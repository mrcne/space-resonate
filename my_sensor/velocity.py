# This was our first attempt at generating x-axis velocity data from our accelerometer.
# Due to the instability of the low end sensor, the output was unworkable.
import sys
import os
import time
from datetime import datetime, date
from Adafruit_LSM303DLHC import LSM303DLHC
import time
import numpy as np

lsm = LSM303DLHC(0x19, 0x1E, False)
lsm.setTempEnabled(True)

Vo=0
while True:
    accel = lsm.readAccelerationsG()
    x=accel.x
    V = Vo+(x*0.1)
    print(V)
    Vo=V
    time.sleep(0.1)
