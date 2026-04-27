import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model once at startup
with open('laptop_price_model.pkl', 'rb') as f:
    model = pickle.load(f)

def build_input(data):
    ssd = float(data.get('ssd_gb', 0))
    hdd = float(data.get('hdd_gb', 0))
    ram = int(data.get('ram_gb', 8))
    ghz = float(data.get('cpu_ghz', 2.5))
    type_name = data.get('type_name', 'Notebook')

    return pd.DataFrame([{
        'Company':      data.get('company', 'Dell'),
        'TypeName':     type_name,
        'Inches':       float(data.get('inches', 15.6)),
        'Ram_GB':       ram,
        'Weight_kg':    float(data.get('weight_kg', 2.0)),
        'Cpu_Brand':    data.get('cpu_brand', 'Intel'),
        'Cpu_GHz':      ghz,
        'Gpu_Brand':    data.get('gpu_brand', 'Intel'),
        'IPS':          int(data.get('ips', 0)),
        'Touchscreen':  int(data.get('touchscreen', 0)),
        'PPI':          float(data.get('ppi', 141)),
        'SSD_GB':       ssd,
        'HDD_GB':       hdd,
        'Has_SSD':      int(ssd > 0),
        'Has_HDD':      int(hdd > 0),
        'OpSys':        data.get('os', 'Windows 10'),
        'Is_Gaming':    int(type_name == 'Gaming'),
        'Is_Ultrabook': int(type_name == 'Ultrabook'),
        'Ram_x_GHz':    ram * ghz,
        'SSD_ratio':    ssd / (ssd + hdd + 1)
    }])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No JSON data received'}), 400

        df = build_input(data)
        price = round(float(np.expm1(model.predict(df)[0])), 2)

        return jsonify({
            'status': 'success',
            'predicted_price': price
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/')
def home():
    return jsonify({'status': 'ok', 'message': 'Laptop Price Predictor API 🚀'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # Render injects PORT env variable — must use it
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
