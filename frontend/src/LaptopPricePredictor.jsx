import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const COMPANIES = ["Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Apple", "Samsung", "Toshiba", "Razer"]
const TYPES = ["Notebook", "Ultrabook", "Gaming", "Workstation", "Netbook", "2 in 1 Convertible"]
const CPU_BRANDS = ["Intel", "AMD"]
const GPU_BRANDS = ["Intel", "Nvidia", "AMD"]
const OS_LIST = ["Windows 10", "Windows 11", "macOS", "Linux", "Chrome OS", "No OS"]
const RAM_OPTIONS = [4, 8, 16, 32, 64]
const SSD_OPTIONS = [0, 128, 256, 512, 1024, 2048]
const HDD_OPTIONS = [0, 500, 1000, 2000]

const defaultForm = {
  company: "Dell",
  type_name: "Notebook",
  inches: 15.6,
  ram_gb: 8,
  weight_kg: 2.0,
  cpu_brand: "Intel",
  cpu_ghz: 2.5,
  gpu_brand: "Intel",
  ips: false,
  touchscreen: false,
  ppi: 141,
  ssd_gb: 256,
  hdd_gb: 0,
  os: "Windows 10",
}

export default function LaptopPricePredictor() {
  const [form, setForm]     = useState(defaultForm)
  const [price, setPrice]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const [step, setStep]     = useState(1) // 1=basic, 2=specs, 3=result

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  async function handlePredict() {
    setLoading(true)
    setError(null)
    setPrice(null)

    try {
      const resp = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ips: form.ips ? 1 : 0,
          touchscreen: form.touchscreen ? 1 : 0,
        }),
      })

      if (!resp.ok) throw new Error(`Server error: ${resp.status}`)

      const data = await resp.json()

      if (data.status === "success") {
        setPrice(data.predicted_price)
        setStep(3)
      } else {
        throw new Error(data.message || "Prediction failed")
      }
    } catch (e) {
      setError(e.message || "Backend connection failed. Make sure API is running.")
    }

    setLoading(false)
  }

  // ─── Styles ──────────────────────────────────────────────────────────────
  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    card: {
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "24px",
      padding: "2.5rem",
      width: "100%",
      maxWidth: "680px",
      color: "#fff",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "0.25rem",
      background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: { color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontSize: "0.9rem" },
    steps: { display: "flex", gap: "0.5rem", marginBottom: "2rem" },
    stepDot: (active, done) => ({
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      background: done ? "#a78bfa" : active ? "#60a5fa" : "rgba(255,255,255,0.15)",
      transition: "all 0.3s",
    }),
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
    group: { display: "flex", flexDirection: "column", gap: "0.4rem" },
    label: { fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
    select: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "10px",
      color: "#fff",
      padding: "0.6rem 0.8rem",
      fontSize: "0.9rem",
      width: "100%",
      outline: "none",
      cursor: "pointer",
    },
    input: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "10px",
      color: "#fff",
      padding: "0.6rem 0.8rem",
      fontSize: "0.9rem",
      width: "100%",
      outline: "none",
      boxSizing: "border-box",
    },
    range: { width: "100%", accentColor: "#a78bfa" },
    rangeVal: { fontSize: "0.85rem", color: "#a78bfa", fontWeight: 700, textAlign: "right" },
    checkRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "0.7rem 1rem",
      cursor: "pointer",
    },
    checkbox: { width: "18px", height: "18px", accentColor: "#a78bfa", cursor: "pointer" },
    btnRow: { display: "flex", gap: "1rem", marginTop: "2rem" },
    btnPrimary: {
      flex: 1,
      padding: "0.85rem",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "1rem",
      cursor: "pointer",
      transition: "opacity 0.2s",
    },
    btnSecondary: {
      padding: "0.85rem 1.5rem",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "transparent",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    },
    error: {
      background: "rgba(239,68,68,0.15)",
      border: "1px solid rgba(239,68,68,0.4)",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      color: "#fca5a5",
      marginTop: "1rem",
      fontSize: "0.9rem",
    },
    resultBox: {
      textAlign: "center",
      padding: "2rem 0",
    },
    priceTag: {
      fontSize: "3.5rem",
      fontWeight: 800,
      background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      lineHeight: 1.1,
    },
    priceLabel: { color: "rgba(255,255,255,0.5)", marginTop: "0.5rem", fontSize: "0.9rem" },
    specGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.5rem",
      marginTop: "1.5rem",
      textAlign: "left",
    },
    specItem: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      padding: "0.5rem 0.75rem",
      fontSize: "0.8rem",
    },
    specKey: { color: "rgba(255,255,255,0.45)", marginBottom: "2px" },
    specVal: { color: "#fff", fontWeight: 600 },
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>💻 Laptop Price Predictor</div>
        <div style={styles.subtitle}>ML-powered pricing — Voting Ensemble · R² = 0.87</div>

        {/* Progress */}
        <div style={styles.steps}>
          {[1, 2, 3].map(s => (
            <div key={s} style={styles.stepDot(step === s, step > s)} />
          ))}
        </div>

        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <>
            <div style={{ ...styles.grid2, marginBottom: "1rem" }}>
              <div style={styles.group}>
                <label style={styles.label}>Brand</label>
                <select style={styles.select} value={form.company} onChange={e => set("company", e.target.value)}>
                  {COMPANIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Type</label>
                <select style={styles.select} value={form.type_name} onChange={e => set("type_name", e.target.value)}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>RAM (GB)</label>
                <select style={styles.select} value={form.ram_gb} onChange={e => set("ram_gb", parseInt(e.target.value))}>
                  {RAM_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Operating System</label>
                <select style={styles.select} value={form.os} onChange={e => set("os", e.target.value)}>
                  {OS_LIST.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div style={{ ...styles.group, marginBottom: "1rem" }}>
              <label style={styles.label}>Screen Size: <span style={{ color: "#a78bfa" }}>{form.inches}"</span></label>
              <input type="range" min={10} max={18} step={0.1} value={form.inches}
                onChange={e => set("inches", parseFloat(e.target.value))} style={styles.range} />
            </div>

            <div style={{ ...styles.group, marginBottom: "1.5rem" }}>
              <label style={styles.label}>Weight: <span style={{ color: "#a78bfa" }}>{form.weight_kg} kg</span></label>
              <input type="range" min={0.5} max={5} step={0.1} value={form.weight_kg}
                onChange={e => set("weight_kg", parseFloat(e.target.value))} style={styles.range} />
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={() => setStep(2)}>
                Next: Hardware Specs →
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Hardware Specs ── */}
        {step === 2 && (
          <>
            <div style={{ ...styles.grid2, marginBottom: "1rem" }}>
              <div style={styles.group}>
                <label style={styles.label}>CPU Brand</label>
                <select style={styles.select} value={form.cpu_brand} onChange={e => set("cpu_brand", e.target.value)}>
                  {CPU_BRANDS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>GPU Brand</label>
                <select style={styles.select} value={form.gpu_brand} onChange={e => set("gpu_brand", e.target.value)}>
                  {GPU_BRANDS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>SSD (GB)</label>
                <select style={styles.select} value={form.ssd_gb} onChange={e => set("ssd_gb", parseInt(e.target.value))}>
                  {SSD_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>HDD (GB)</label>
                <select style={styles.select} value={form.hdd_gb} onChange={e => set("hdd_gb", parseInt(e.target.value))}>
                  {HDD_OPTIONS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>

            <div style={{ ...styles.group, marginBottom: "1rem" }}>
              <label style={styles.label}>CPU Speed: <span style={{ color: "#a78bfa" }}>{form.cpu_ghz} GHz</span></label>
              <input type="range" min={1} max={5} step={0.1} value={form.cpu_ghz}
                onChange={e => set("cpu_ghz", parseFloat(e.target.value))} style={styles.range} />
            </div>

            <div style={{ ...styles.group, marginBottom: "1rem" }}>
              <label style={styles.label}>PPI (Pixel Density): <span style={{ color: "#a78bfa" }}>{form.ppi}</span></label>
              <input type="range" min={80} max={400} step={1} value={form.ppi}
                onChange={e => set("ppi", parseInt(e.target.value))} style={styles.range} />
            </div>

            <div style={{ ...styles.grid2, marginBottom: "1.5rem" }}>
              <label style={styles.checkRow} onClick={() => set("ips", !form.ips)}>
                <input type="checkbox" checked={form.ips} readOnly style={styles.checkbox} />
                <span>IPS Display</span>
              </label>
              <label style={styles.checkRow} onClick={() => set("touchscreen", !form.touchscreen)}>
                <input type="checkbox" checked={form.touchscreen} readOnly style={styles.checkbox} />
                <span>Touchscreen</span>
              </label>
            </div>

            {error && <div style={styles.error}>⚠️ {error}</div>}

            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
                onClick={handlePredict} disabled={loading}>
                {loading ? "Predicting..." : "Predict Price 💰"}
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Result ── */}
        {step === 3 && price !== null && (
          <>
            <div style={styles.resultBox}>
              <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
                Estimated Price
              </div>
              <div style={styles.priceTag}>
                {price.toLocaleString("en-EG", { maximumFractionDigits: 0 })} EGP
              </div>
              <div style={styles.priceLabel}>
                Based on Voting Ensemble model · R² = 0.87
              </div>
            </div>

            <div style={styles.specGrid}>
              {[
                ["Brand", form.company],
                ["Type", form.type_name],
                ["RAM", `${form.ram_gb} GB`],
                ["Storage", `${form.ssd_gb > 0 ? form.ssd_gb + "GB SSD" : ""} ${form.hdd_gb > 0 ? form.hdd_gb + "GB HDD" : ""}`.trim()],
                ["CPU", `${form.cpu_brand} @ ${form.cpu_ghz}GHz`],
                ["GPU", form.gpu_brand],
                ["Screen", `${form.inches}" · ${form.ppi} PPI`],
                ["OS", form.os],
              ].map(([k, v]) => (
                <div key={k} style={styles.specItem}>
                  <div style={styles.specKey}>{k}</div>
                  <div style={styles.specVal}>{v}</div>
                </div>
              ))}
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => { setStep(1); setPrice(null); setForm(defaultForm) }}>
                🔄 Reset
              </button>
              <button style={styles.btnPrimary} onClick={() => setStep(2)}>
                ← Edit Specs
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
