import sys
import glob
import serial
import time
from mongoupdate import main as mongoupdate

def serial_ports():
    # Get all USB ports identified as occupied by Pi
    """ Lists serial port names

        :raises EnvironmentError:
            On unsupported or unknown platforms
        :returns:
            A list of the serial ports available on the system
    """
    if sys.platform.startswith('win'):
        ports = ['COM%s' % (i + 1) for i in range(256)]
    elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
        # this excludes your current terminal "/dev/tty"
        ports = glob.glob('/dev/tty[A-Za-z]*')
    elif sys.platform.startswith('darwin'):
        ports = glob.glob('/dev/tty.*')
    else:
        raise EnvironmentError('Unsupported platform')

    result = []
    for port in ports:
        try:
            s = serial.Serial(port)
            s.close()
            result.append(port)
        except (OSError, serial.SerialException):
            pass
    filteredlist = []
    for detectedPort in result:
        if "ACM" in str(detectedPort): # Only allow ACMs into filteredlist, i.e. the bluno beetle RXes
            filteredlist.append(detectedPort)
    return filteredlist

def extractVitalReading(start,result):
    try:
        return float((result.split(start))[1].split(" ")[0])
    except:
        return -999.99
    

if __name__ == '__main__':
    NRICs = ["T3079602Y"] # For testing only "S1357975K","T2468086F"
    counter = 1 # Patient number
    # Auto-assign usb ports to list of serial objects
    # it does not matter whether ser[0] is MAX or MLX,
    # this will be dealt with using identifier values transmitted by the TX blunos
    for NRIC in NRICs:
        for session in range(0,2): # 2 sessions per patient
            ser = []
            for port in serial_ports():
                ser.append(serial.Serial(port,115200))
            
            firstValue = True # Sentinel value to notify mongoupdate to open a new statsSession
            lastValue = False # Sentinel value to notify mongoupdate to close current statsSession

            numReadings = 100 # Number of datapoints per session is 100
            for k in range(0,numReadings): # Take readings for 100 datapoints
                print("Session: #"+str(session+1)+" Datapoint: #"+str(k+1))
                if k > 0: # If this is the first reading set, adjust firstValue sentinel boolean to False
                    firstValue = False
                if k == numReadings - 1: # If this is the last reading set, adjust lastValue sentinel boolean to True
                    lastValue = True
                temperature = 37.0
                heart_rate = 76
                spo2 = 97
                result = ""
                to_add = ""
                
                for ser_object in ser:
                    while ser_object.inWaiting() == False:
                        time.sleep(2) # Wait for serial data to come in
                        break
                    while ser_object.inWaiting():
                        to_add = str(ser_object.readline())
                    result += to_add
                if len(result) < 5:
                    print("No data received")
                    result = "b'P"+str(counter)+"T: 37.0 \r\n'b'P"+str(counter)+"HR: 76 P"+str(counter)+"SPO2: 97 \r\n'"
                #Expected result is similar to b'T: 36.7 \r\n'b'HR: 80 SPO2: 99 \r\n'
                # Note the single space after every numerical reading, it is essential for extractVitalReading() function
                temperature = extractVitalReading("P"+str(counter)+"T: ",result) # Get Temperature
                heart_rate = extractVitalReading("P"+str(counter)+"HR: ",result)# Get Heart Rate
                spo2 = extractVitalReading("P"+str(counter)+"SPO2: ",result)# Get SPO2
                print("Patient:",str(counter),"Temperature:",str(temperature),"Heart Rate: ",str(heart_rate),"SPO2: ",str(spo2))
                # timestamp = extractVitalReading("Datetime: ",result)# Get Timestamp
                mongoupdate(str(temperature),str(heart_rate),str(spo2),firstValue,lastValue,NRIC)
                print("----------------------------------------------------------")
