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
    time.sleep(0.1)
    if count>2500:
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
filename="RawData/"
filename+=str(datetime.now())
filename = filename.replace(" ", "")
filename+='.csv'



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

