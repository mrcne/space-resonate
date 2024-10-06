# This was our second, more succesful attempt at generating x-axis velocity data from our accelerometer.
# We added an averaging function which rectified the isseues experienced in the previous version.
# We also added a function to output data in the same format as the NASA sample data, to ensure compatibility with our analysis model.

import numpy as np
import sys
import os
import time
from datetime import datetime, date
from Adafruit_LSM303DLHC import LSM303DLHC
import time
import numpy as np
import csv

lsm = LSM303DLHC(0x19, 0x1E, False)
lsm.setTempEnabled(True)

Vo=0
count=0

accelxDict = {}
averageList = []


dts=datetime.now()
print("Capture start time:",dts)

while True:
    accel = lsm.readAccelerationsG()
    x=accel.x
    dts=datetime.now()
    dts=str(dts)
    accelxDict[dts] = x
    count+=1
    time.sleep(0.01)
    if count>13000: # Approx 5 mins capture for test purposes, but change to 3744000 (24 hours) for actual mission deployment.
        break

dts=datetime.now()
print("Capture stop time:",dts)

def calculate_average(numbers):
    if not numbers:  # Check if the list is empty
        return 0
    return sum(numbers) / len(numbers)

for value in accelxDict.values():
    averageList.append(value)

Vo = calculate_average(averageList)
#print("The average is Vo value is:", Vo)

# Create file with timestamp name for results
filename="RawData/xa.s100.hz."
NASA_dts_format = "%Y-%m-%d"
now = datetime.now()
formatted_date = now.strftime(NASA_dts_format)
filename+=formatted_date
filename+="HR00"
#filename = filename.replace(" ", "")
filename+='.csv'

# Define the header
headers = ['time_abs', 'time_rel', 'velocity']
# Write the header to the CSV file
with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(headers)

# Loop through the dictionary and calculate velocity using value field.  
# Then write timestamp + value to file.
for key, value in accelxDict.items():
    V = Vo+(value*0.1)
    #print("V=",Vo,"+(",value,"x 0.1)=",V)
    #print(key,V)
    new_row = [key, V]
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(new_row)

print("Data written to",filename)

