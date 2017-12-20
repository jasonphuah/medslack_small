import pymongo
import datetime
from pymongo import MongoClient
import simplejson as json

def updateJsonFile(input_data):
    with open('data.json', mode='r') as existing_file:
        existing_data = json.load(existing_file)

    with open('data.json','w') as existing_file:
        existing_data.append(input_data)
        json.dump(existing_data, existing_file)

def loadJsonFile():
     with open('data.json', mode='r') as existing_file:
        existing_data = json.load(existing_file)
        return existing_data

def main(temperature,heart_rate,spo2,firstValue,lastValue,NRIC):
    # Establishing connection with Mlab

    client = MongoClient('mongodb://test:test@ds159662.mlab.com:59662/medslack')

    # Database name: medslack

    db = client['medslack']

    # Collection: patients

    patients = db['patients']

    statsSession= {
            "updated_at":  datetime.datetime.now(), # When statsSession is created
            "end_at": "-1", # When statsSession is ended, leave it as -1 until the session has truly ended
            "stats":[]
    }

    find_patient = patients.find_one({"NRIC": NRIC})
    if firstValue == True: # Create new statsSession for the first reading set
        find_patient['statistics'].append(statsSession)

    input_data = {"temperature":78,
             "hr": 80,
            "spo2": 99,
            #"updated_at": datetime.datetime.now()
            }

    #Write data to local json
    updateJsonFile(input_data)

    # Reading data back and pushing to MongoDB
    read_back_data = loadJsonFile()
    for each_data in read_back_data:
        find_patient['statistics'][-1]['stats'].append(each_data)
        #find_patient['statistics'][-1]['end_at'] = datetime.datetime.now()

        try:
            patients.save(find_patient)
            print("Database updated")
        except:
            print("Failed to update database")

if __name__=='__main__':
    main(0,0,0,False,False,"G1021307Q")
