import os
import time
import numpy as np
import pandas as pd
from obspy import read
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import os
from pykalman import KalmanFilter
import skopt
from skopt import gp_minimize
from scipy import signal
import csv

def find_row_number(csv_file, search_value):
    with open(csv_file, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row_number, row in enumerate(reader, start=1):  # Start counting from 1
            if search_value in row:
                return row_number
    return -1  # Return -1 if not found




def count_files_in_directory(directory):
    try:
        # List all files and directories in the specified directory
        files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
        return len(files)
    except Exception as e:
        print(f"An error occurred: {e}")
        return 0

# Specify the directory path
directory_path = '/home/pi/apps/space-resonate/my_sensor/RawData'
number_of_files = count_files_in_directory(directory_path)


def get_first_file_in_directory(directory):
    try:
        # List all files in the directory
        files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

        # Sort files alphabetically
        files.sort()

        # Return the first file if any exist
        if files:
            return files[0]
        else:
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None




def analyse():
    global first_file
    """Let's take a look at the training data for the lunar dataset. In addition to the data itself, we include a catalog that will tell you which events happen when in the data. The catalog includes the name of the file, the absolute time, the relative time in seconds (relative to the start of the file), the event ID (evid), and the type of moonquake. The types of moonquakes include impacts, deep moonquakes, and shallow moonquakes. You do not have to worry about predicting the type of moonquakes, that's just fun information for you to know!

    **Note**: For your prediction, feel free to include either the absolute time or relative time, just make sure to mark it using the same header in the CSV file so we can easily score it!
    """

    cat_directory = 'RawData/'
    cat_file = first_file #'xa.s100.hz.2024-10-06HR00.csv'
    full_path = os.path.join(cat_directory, cat_file)
    cat = pd.read_csv(full_path)

    """Let's pick the first seismic event in the catalog and let's take a look at the absolute time data. The way we show it here is by using pandas `.iloc` and datetime `.strptime`. We are going to keep the format shown in the absolute time header, which is `'%Y-%m-%dT%H:%M:%S.%f'`"""

    row = cat.iloc[0]
# arrival_time = datetime.strptime(row['time_abs(%Y-%m-%dT%H:%M:%S.%f)'],'%Y-%m-%dT%H:%M:%S.%f')
# arrival_time

# If we want the value of relative time, we don't need to use datetime
    arrival_time_rel = row[0]
    arrival_time_rel

    """## Read the CSV file corresponding to that detection

    We will now find the csv data file corresponding to that time and plot it!
    """

    data_directory = '/content/drive/My Drive/NASA 2024 Space Apps Challenge Seismic/Sensor_data/'
    csv_file = 'test_file1.csv'
    full_path = os.path.join(cat_directory, cat_file)
    data_cat = pd.read_csv(full_path)
    # data_cat = pd.read_csv(csv_file)
    data_cat

# Read in time steps and velocities
    csv_times = np.array(data_cat.iloc[:,0])
# print(csv_times.all[10:19])
    csv_data = np.array(data_cat.iloc[:,1])

    data_cat['timestamp'] = pd.to_datetime(csv_times)  # Convert to datetime if necessary
    data_cat['time_diff'] = data_cat['timestamp'].diff().dt.total_seconds()  # Compute time differences

# Calculate the average sampling interval
    avg_sampling_interval = data_cat['time_diff'].mean()
    sampling_frequency = 1 / avg_sampling_interval  # In Hz
    print(sampling_frequency)

# Plot the trace!
    fig,ax = plt.subplots(1,1,figsize=(12,8))
    ax.plot(csv_data)

# Make the plot pretty
# ax.set_xlim([min(csv_times),max(csv_times)])
    ax.set_ylabel('Velocity (m/s)')
    ax.set_xlabel('Time (s)')
    ax.set_title('Human Quake (Impact) Accelerometer', fontweight='bold')

# Plot where the arrival time is
# arrival_line = ax.axvline(x=arrival_time_rel, c='red', label='Rel. Arrival')
# ax.legend(handles=[arrival_line])

# To better see the patterns, we will create a spectrogram using the scipy function
# It requires the sampling rate, which we can get from the miniseed header as shown a few cells above
# print(data_cat.iloc[:,1])
# Ensure you are working with numerical values
    input_data = data_cat.iloc[:,1].astype(float).values  # Ensure input is numeric

# Set a suitable nperseg value
    nperseg_value = min(256, len(input_data))  # Use 256 or length of input, whichever is smaller

# Compute the spectrogram
# f, t, sxx = signal.spectrogram(input_data, sampling_frequency, nperseg=nperseg_value)
# f, t, sxx = signal.spectrogram(input_data, 100)
    f,t,sxx = signal.spectrogram(input_data, fs=100, window=('tukey', 5), nperseg=256, noverlap=None, nfft=1024, detrend='constant', return_onesided=True, scaling='density', axis=-1, mode='psd')

# f, t, sxx = signal.spectrogram(data_cat.iloc[1,:], sampling_frequency)

# Set up Kalman Filter parameters
    n_frequencies = sxx.shape[0]  # Number of frequency bins
    smoothed_states = np.zeros_like(sxx)  # To store smoothed states
    peculiar_structures = np.zeros_like(sxx)  # To store peculiar structures (0 = normal, 1 = peculiar)

# Loop over each frequency bin to apply Kalman Filter
    for i in range(n_frequencies):
    # Extract the time series for the current frequency
        measurements = sxx[i, :]

    # Define the Kalman Filter
        kf = KalmanFilter(
            transition_matrices=np.array([[1]]),  # Identity transition matrix
            observation_matrices=np.array([[1]]),  # Observation matrix
            initial_state_mean=measurements[0],     # Start at the first value of the series
            initial_state_covariance=0.1,              # Initial guess for state covariance
            observation_covariance=0.1,                 # Observation noise
            transition_covariance=1                 # Model noise
        )

    # Estimate the smoothed state (filtered signal)
        smoothed_state, _ = kf.smooth(measurements)

    # Store the smoothed state (flattening to 1D)
        smoothed_states[i, :] = smoothed_state.flatten()

    # Define threshold for detecting peculiar structures (example: mean + 2 * std)
    # threshold = np.mean(smoothed_state.flatten()) + 2 * np.std(smoothed_state.flatten())
    # threshold = np.mean(smoothed_state.flatten()) / np.std(smoothed_state.flatten())
        threshold = np.mean(smoothed_state.flatten())

    # Detect peculiar structures (where smoothed state > threshold)
        peculiar_indices = np.where(smoothed_state.flatten() > threshold)[0]  # Get the indices
        peculiar_structures[i, peculiar_indices] = 1  # Mark peculiar structures at those indices


# Plot the original and smoothed spectrogram
    plt.figure(figsize=(12, 8))
    plt.subplot(3, 1, 1)
    plt.title('Original Spectrogram')
    plt.pcolormesh(t, f, 10 * np.log10(sxx), cmap='jet')
# ax2.set_xlim([min(tr_times_filt),max(tr_times_filt)])
    plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
    plt.ylabel('Frequency [Hz]', fontweight='bold')
    plt.colorbar(label='Intensity [dB]')

    plt.subplot(3, 1, 2)
    plt.title('Smoothed Spectrogram using Kalman Filter')
    plt.pcolormesh(t, f, 10 * np.log10(smoothed_states), cmap='jet')
    plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
    plt.ylabel('Frequency [Hz]', fontweight='bold')
    plt.colorbar(label='Intensity [dB]')

    plt.subplot(3, 1, 3)
# plt.plot(peculiar_structures)
    plt.title('Peculiar Structures Detected')
    plt.pcolormesh(t, f, peculiar_structures, cmap='jet')
    plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
    plt.ylabel('Frequency [Hz]', fontweight='bold')
    plt.colorbar(label='Peculiar Structure (1 = Peculiar)')

    plt.tight_layout()
    plt.show()

# Set up Kalman Filter parameters
    n_frequencies = sxx.shape[0]  # Number of frequency bins
    smoothed_states = np.zeros_like(sxx)  # To store smoothed states
    peculiar_structures = np.zeros_like(sxx)  # To store peculiar structures (0 = normal, 1 = peculiar)

# Loop over each frequency bin to apply Kalman Filter
    for i in range(n_frequencies):
    # Extract the time series for the current frequency
        measurements = sxx[i, :]

    # Define the Kalman Filter
        kf = KalmanFilter(
            transition_matrices=np.array([[1]]),  # Identity transition matrix
            observation_matrices=np.array([[1]]),  # Observation matrix
            initial_state_mean=measurements[0],     # Start at the first value of the series
            initial_state_covariance=0.1,              # Initial guess for state covariance
            observation_covariance=0.1,                 # Observation noise
            transition_covariance=1                 # Model noise
        )

    # Estimate the smoothed state (filtered signal)
        smoothed_state, _ = kf.smooth(measurements)

    # Store the smoothed state (flattening to 1D)
        smoothed_states[i, :] = smoothed_state.flatten()

    # Define threshold for detecting peculiar structures (example: mean + 2 * std)
    # threshold = np.mean(smoothed_state.flatten()) - 2 * np.std(smoothed_state.flatten())
    # threshold = np.mean(smoothed_state.flatten()) / np.std(smoothed_state.flatten())
        threshold = np.mean(smoothed_state.flatten())

    # Detect peculiar structures (where smoothed state > threshold)
        peculiar_indices = np.where(smoothed_state.flatten() > threshold)[0]  # Get the indices

    # Find the first occurrence of a peculiar structure, if any
        if len(peculiar_indices) > 0:
            first_peculiar_index = peculiar_indices[0]  # Get the first occurrence
            print(f"First peculiar structure detected at index {first_peculiar_index} (time: {t[first_peculiar_index]})")
            peculiar_structures[i, first_peculiar_index] = 1  # Mark the first peculiar structure
        # Create a DataFrame
        data_track = {
            "Index": [first_peculiar_index],
            "Time": [t[first_peculiar_index]]
              }
        df = pd.DataFrame(data_track)

    # Save to CSV
        csv_file = "TxReady/peculiar_structure_sensor.csv"
        df.to_csv(csv_file, index=False)

    print(f"Data saved to {csv_file}")

    # Get list of event timestamps from analysis output file
    with open(csv_file, mode='r', newline='') as file:
        reader = csv.reader(file)
        second_column = [row[1] for row in reader if len(row) > 1]  # Ensure there's a second column

    # Strip 2 mins of data following event detection, and write to new csv file ready for transmit.
    for item in second_column:
        search_value = item  # Replace with the value you're looking for
        row_number = find_row_number("RawData/"+first_file, search_value)

        if row_number != -1:
            print(f'Value found in row: {row_number}')
        else:
            print('Value not found.')

    #with open("RawData/"+first_file)



# Plot the original and smoothed spectrogram
#plt.figure(figsize=(12, 8))
#plt.subplot(3, 1, 1)
#plt.title('Original Spectrogram')
#plt.pcolormesh(t, f, 10 * np.log10(sxx),  cmap='jet')
#plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
#plt.ylabel('Frequency [Hz]', fontweight='bold')
#plt.colorbar(label='Intensity [dB]')

#plt.subplot(3, 1, 2)
#plt.title('Smoothed Spectrogram using Kalman Filter')
#plt.pcolormesh(t, f, 10 * np.log10(smoothed_states),  cmap='jet')
#plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
#plt.ylabel('Frequency [Hz]', fontweight='bold')
#plt.colorbar(label='Intensity [dB]')

#plt.subplot(3, 1, 3)
#plt.title('First Peculiar Structures Detected')
#plt.pcolormesh(t, f, peculiar_structures, cmap='jet')
#plt.xlabel(f'Time (Day Hour:Minute)', fontweight='bold')
# plt.axvline(x=arrival, c='red')
#plt.ylabel('Frequency [Hz]', fontweight='bold')
#plt.colorbar(label='Peculiar Structure (1 = Peculiar)')

#plt.tight_layout()
#plt.show()

"""Kalman filter based thresholding for STA/LTA thresholding function:
Different ways to optimize the STA/LTA method:
1) Signal Smoothing
2) Dynamic Model
3) State Estimation
4) Adaptive Thresholding
"""



while True:
        global first_file
        directory_path = '/home/pi/apps/space-resonate/my_sensor/RawData'
        number_of_files = count_files_in_directory(directory_path)
        if number_of_files >0:
                print("files available")
                first_file = get_first_file_in_directory(directory_path)
                analyse()
                os.remove("RawData/"+first_file)
                print(f"Deleted the file: {first_file}")
        else:
                print("Waiting for file")
                time.sleep(10)
