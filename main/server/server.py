import random
from flask import Flask, render_template, abort, request, jsonify
import json
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

#Testing connection with MongoDB
try:
    conn=pymongo.MongoClient()
    print ("Connected successfully!!!")
except:
   print ("Error")
# Establishing connection with Mlab
client = MongoClient('mongodb://test:test@ds159662.mlab.com:59662/medslack')
# Database name: medslack
db = client['medslack']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/patients', methods=['GET'])
def all_patients():
    patients = db.patients.find()
    results = {}
    for i, j in enumerate(patients):
        results[i] = {'id': str(j['_id']), 'patient_name' : j['name'], 'NRIC': j['NRIC']}
    if patients:
        return jsonify(results)
    else:
        return 'Fucking No patients found'

@app.route('/api/patients/new', methods=['GET','POST'])
def new_patient():
    if request.method == 'POST':
        input_data = request.get_json()
        name = input_data['name']
        age = input_data['age']
        nric = input_data['nric']
        # Create a Test Patient
        test_patient= {
                "name": name,
                "age": age,
                "NRIC": nric,
                "updated_at": str(datetime.datetime.now()),
                "statistics": []
        }
        new_patient = db.patients.insert_one(test_patient)
        return "success"
    return json.dumps({'status':'OK'});


@app.route('/api/patients/<patient_id>', methods=['GET'])
def find_patient(patient_id):
    patient = db.patients.find_one({"_id" : ObjectId(patient_id)})
    result = {'patient_name': patient['name'], 'statistics' : patient['statistics'] }
    return jsonify(result)

if __name__ == '__main__':
    app.run()
