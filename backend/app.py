import os
import pickle
import traceback
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

with open("laptop_price_model.pkl", "rb") as f:
    model = pickle.load(f)

# Detect if the model is a Pipeline (accepts raw strings) or a plain estimator (needs encoding)
IS_PIPELINE = hasattr(model, "steps")

# ---------- Column order used when training the plain GBR (55 features) ----------
# Reconstructed from pd.get_dummies on the original Kaggle laptop dataset
NUMERIC_COLS = [
    "Inches", "Ram_GB", "Weight_kg", "Cpu_GHz",
    "IPS", "Touchscreen", "PPI",
    "SSD_GB", "HDD_GB", "Has_SSD", "Has_HDD",
    "Is_Gaming", "Is_Ultrabook", "Ram_x_GHz", "SSD_ratio",
]

COMPANY_CATS    = ["Acer","Apple","Asus","Chuwi","Dell","Fujitsu","Google","HP","Huawei",
                   "LG","Lenovo","MSI","Mediacom","Microsoft","Razer",
                   "Samsung","Toshiba","Vero","Xiaomi"]
TYPENAME_CATS   = ["2 in 1 Convertible","Gaming","Netbook","Notebook","Ultrabook","Workstation"]
CPUBRAND_CATS   = ["AMD","Intel"]
GPUBRAND_CATS   = ["AMD","ARM","Intel","Nvidia"]
OPSYS_CATS      = ["Chrome OS","Linux","Mac OS X","No OS",
                   "Windows 10","Windows 10 S","Windows 11","Windows 7","macOS"]

def build_raw(data):
    """Build the 20-feature dict understood by a Pipeline model."""
    ssd = float(data.get("ssd_gb", 0))
    hdd = float(data.get("hdd_gb", 0))
    ram = int(data.get("ram_gb", 8))
    ghz = float(data.get("cpu_ghz", 2.5))
    type_name = data.get("type_name", "Notebook")
    return {
        "Company":      data.get("company", "Dell"),
        "TypeName":     type_name,
        "Inches":       float(data.get("inches", 15.6)),
        "Ram_GB":       ram,
        "Weight_kg":    float(data.get("weight_kg", 2.0)),
        "Cpu_Brand":    data.get("cpu_brand", "Intel"),
        "Cpu_GHz":      ghz,
        "Gpu_Brand":    data.get("gpu_brand", "Intel"),
        "IPS":          int(data.get("ips", 0)),
        "Touchscreen":  int(data.get("touchscreen", 0)),
        "PPI":          float(data.get("ppi", 141)),
        "SSD_GB":       ssd,
        "HDD_GB":       hdd,
        "Has_SSD":      int(ssd > 0),
        "Has_HDD":      int(hdd > 0),
        "OpSys":        data.get("os", "Windows 10"),
        "Is_Gaming":    int(type_name == "Gaming"),
        "Is_Ultrabook": int(type_name == "Ultrabook"),
        "Ram_x_GHz":    ram * ghz,
        "SSD_ratio":    ssd / (ssd + hdd + 1),
    }

def one_hot(val, cats):
    return [1 if val == c else 0 for c in cats]

def build_encoded(raw):
    """Convert the raw dict to the encoded numpy array for plain GBR."""
    nums = [raw[c] for c in NUMERIC_COLS]
    encoded = (
        nums
        + one_hot(raw["Company"],   COMPANY_CATS)
        + one_hot(raw["TypeName"],  TYPENAME_CATS)
        + one_hot(raw["Cpu_Brand"], CPUBRAND_CATS)
        + one_hot(raw["Gpu_Brand"], GPUBRAND_CATS)
        + one_hot(raw["OpSys"],     OPSYS_CATS)
    )
    return np.array(encoded).reshape(1, -1)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No JSON data received"}), 400

        raw = build_raw(data)

        if IS_PIPELINE:
            df = pd.DataFrame([raw])
            price = round(float(np.expm1(model.predict(df)[0])), 2)
        else:
            # Plain estimator — encode manually
            X = build_encoded(raw)
            price = round(float(np.expm1(model.predict(X)[0])), 2)

        return jsonify({"status": "success", "predicted_price": price})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "Laptop Price Predictor API"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
