import pymongo
import datetime
from pymongo import MongoClient

def main(name,age,NRIC):
    # Establishing connection with Mlab 

    client = MongoClient('mongodb://test:test@ds159662.mlab.com:59662/medslack')

    # Database name: medslack

    db = client['medslack']

    # Collection: patients

    patients = db['patients']


    # Create a Test Patient
    test_patient= {
            "name": name,
            "age": age,
            "NRIC": NRIC,
            "updated_at": datetime.datetime.now(),
            "statistics":[]
    }

    # Find the patient by NRIC in the Collection, if found, do nothing (e.g. don't create a duplicated patient).
    # If not found, create a new patient.
    find_patient = patients.find_one({"NRIC": str(NRIC)})

    if find_patient is None:
            print("No such patient found, creating new patient",name)
            new_patient = patients.insert_one(test_patient)

    return name,age,NRIC

if __name__=='__main__':
    main("Bobby","32","T3079602Y")
