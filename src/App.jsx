import { useState, useEffect, useCallback, useRef } from "react";

// ── ICONS (inline SVG) ──
const Icons = {
  cart: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.4.4-.1 1 .4 1h12.6M16 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>,
  chart: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4 20h16M4 20V4m0 16l4-4v4m4 0V10m0 10l4-6v6m4 0V6l-4 4"/></svg>,
  clock: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  gear: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  plus: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  trash: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>,
  send: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  alert: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
  check: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  box: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  chevDown: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>,
  x: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  edit: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

// ── STYLES ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #f8f9fb;
    --surface: #ffffff;
    --surface-raised: #ffffff;
    --border: rgba(0,0,0,0.08);
    --border-strong: rgba(0,0,0,0.14);
    --text: #1a1d23;
    --text-secondary: #5f6573;
    --text-muted: #9198a5;
    --accent: #2563eb;
    --accent-soft: #eff4ff;
    --success: #059669;
    --success-soft: #ecfdf5;
    --warning: #d97706;
    --warning-soft: #fffbeb;
    --danger: #dc2626;
    --danger-soft: #fef2f2;
    --radius: 10px;
    --radius-sm: 6px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04);
    --font: 'DM Sans', -apple-system, sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --transition: 180ms cubic-bezier(0.25, 1, 0.5, 1);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  .app-header {
    padding: 16px 20px 12px;
    background: var(--surface);
    border-bottom: 0.5px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .app-header h1 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .app-header .subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .content {
    flex: 1;
    padding: 16px 16px 100px;
    overflow-y: auto;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    display: flex;
    background: var(--surface);
    border-top: 0.5px solid var(--border);
    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
    z-index: 100;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-family: var(--font);
    font-size: 10px;
    font-weight: 500;
    transition: color var(--transition);
  }

  .nav-item.active { color: var(--accent); }

  .card {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 16px;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .field { margin-bottom: 14px; }
  .field:last-child { margin-bottom: 0; }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .field input, .field textarea {
    width: 100%;
    padding: 10px 12px;
    border: 0.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 14px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
  }

  .field input:focus, .field textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }

  .field input::placeholder { color: var(--text-muted); }

  .custom-select {
    position: relative;
  }

  .custom-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 12px;
    border: 0.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--surface);
    font-family: var(--font);
    font-size: 14px;
    color: var(--text);
    cursor: pointer;
    transition: border-color var(--transition);
    white-space: nowrap;
  }

  .custom-select-trigger.placeholder { color: var(--text-muted); }
  .custom-select-trigger:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

  .custom-select-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--surface);
    border: 0.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 200;
    max-height: 220px;
    overflow-y: auto;
  }

  .custom-select-option {
    padding: 10px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background var(--transition);
    border-bottom: 0.5px solid var(--border);
  }

  .custom-select-option:last-child { border-bottom: none; }
  .custom-select-option:hover, .custom-select-option:active { background: var(--accent-soft); }
  .custom-select-option.selected { color: var(--accent); font-weight: 600; }

  .line-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 0.5px solid var(--border);
  }

  .line-item:last-child { border-bottom: none; }

  .line-item-info { flex: 1; min-width: 0; }
  .line-item-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .line-item-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; font-family: var(--mono); }

  .line-item-amount {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    padding-top: 1px;
  }

  .line-item-remove {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all var(--transition);
    margin-top: -1px;
  }

  .line-item-remove:hover { color: var(--danger); background: var(--danger-soft); }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    width: 100%;
  }

  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-secondary {
    background: var(--bg);
    color: var(--text);
    border: 0.5px solid var(--border-strong);
    width: 100%;
  }

  .btn-secondary:hover { background: #eef0f4; }

  .btn-success {
    background: var(--success);
    color: white;
    width: 100%;
  }

  .add-item-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px dashed rgba(37,99,235,0.3);
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: all var(--transition);
  }

  .add-item-btn:hover { background: #dfe8ff; }

  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }

  .kpi-card {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    box-shadow: var(--shadow);
  }

  .kpi-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .kpi-value {
    font-family: var(--mono);
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-top: 4px;
    font-variant-numeric: tabular-nums;
  }

  .kpi-value.danger { color: var(--danger); }
  .kpi-value.success { color: var(--success); }

  .stock-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 0.5px solid var(--border);
    gap: 12px;
  }

  .stock-row:last-child { border-bottom: none; }

  .stock-name { font-size: 13px; font-weight: 600; flex: 1; min-width: 0; }
  .stock-name span { display: block; font-size: 11px; font-weight: 400; color: var(--text-muted); margin-top: 1px; }

  .stock-qty {
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 600;
    text-align: right;
    min-width: 48px;
  }

  .stock-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .stock-badge.ok { background: var(--success-soft); color: var(--success); }
  .stock-badge.low { background: var(--warning-soft); color: var(--warning); }

  .invoice-card {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: var(--shadow);
  }

  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .invoice-id { font-family: var(--mono); font-size: 13px; font-weight: 600; }
  .invoice-total { font-family: var(--mono); font-size: 14px; font-weight: 700; color: var(--success); }
  .invoice-meta { font-size: 11px; color: var(--text-muted); }

  .invoice-items {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 0.5px solid var(--border);
  }

  .invoice-item-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 3px 0;
    color: var(--text-secondary);
  }

  .invoice-item-row span:last-child { font-family: var(--mono); }

  .toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text);
    color: white;
    padding: 12px 20px;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    animation: slideDown 300ms ease;
    max-width: 90vw;
  }

  .toast.success { background: var(--success); }
  .toast.error { background: var(--danger); }

  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 150;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 200ms ease;
  }

  .bottom-sheet {
    background: var(--surface);
    width: 100%;
    max-width: 480px;
    border-radius: 16px 16px 0 0;
    padding: 20px;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 250ms cubic-bezier(0.25, 1, 0.5, 1);
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

  .sheet-handle {
    width: 36px;
    height: 4px;
    background: var(--border-strong);
    border-radius: 2px;
    margin: 0 auto 16px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }

  .empty-state .icon { font-size: 32px; margin-bottom: 8px; }
  .empty-state p { font-size: 13px; }

  .settings-input {
    font-family: var(--mono) !important;
    font-size: 12px !important;
  }

  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }

  .status-dot.connected { background: var(--success); }
  .status-dot.disconnected { background: var(--danger); }

  .total-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1.5px solid var(--text);
    margin-top: 8px;
  }

  .total-label { font-size: 14px; font-weight: 700; }
  .total-amount { font-family: var(--mono); font-size: 18px; font-weight: 700; }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 600ms linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .qty-control {
    display: flex;
    align-items: center;
    gap: 0;
    border: 0.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .qty-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
    transition: background var(--transition);
  }

  .qty-btn:active { background: #dde1e8; }

  .qty-input {
    width: 48px;
    text-align: center;
    border: none;
    border-left: 0.5px solid var(--border);
    border-right: 0.5px solid var(--border);
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 600;
    padding: 8px 0;
    outline: none;
    background: var(--surface);
  }

  .search-input {
    width: 100%;
    padding: 10px 12px;
    border: 0.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 14px;
    outline: none;
    margin-bottom: 8px;
  }

  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }

  .product-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 0.5px solid var(--border);
    cursor: pointer;
    transition: background var(--transition);
  }

  .product-option:active { background: var(--accent-soft); }
  .product-option-name { font-size: 14px; font-weight: 500; }
  .product-option-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
  .product-option-price { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--accent); }
`;

// ── CUSTOM SELECT COMPONENT ──
function Select({ label, value, options, onChange, placeholder, displayKey = "label", valueKey = "value" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => (typeof o === "string" ? o : o[valueKey]) === value);
  const display = selected ? (typeof selected === "string" ? selected : selected[displayKey]) : null;

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="custom-select" ref={ref}>
        <button type="button" className={`custom-select-trigger ${!display ? 'placeholder' : ''}`} onClick={() => setOpen(!open)}>
          <span>{display || placeholder || "Select..."}</span>
          {Icons.chevDown}
        </button>
        {open && (
          <div className="custom-select-dropdown">
            {options.map((o, i) => {
              const val = typeof o === "string" ? o : o[valueKey];
              const lbl = typeof o === "string" ? o : o[displayKey];
              return (
                <div key={i} className={`custom-select-option ${val === value ? 'selected' : ''}`}
                  onClick={() => { onChange(val); setOpen(false); }}>
                  {lbl}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── COMBOBOX (Searchable with Add New option) ──
function ComboBox({ label, value, options, onChange, placeholder, apiUrl, onCustomerAdded }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchValue = value || "";
  const filtered = options.filter(o =>
    (o.name || "").toLowerCase().includes(searchValue.toLowerCase()) ||
    (o.id || "").toString().toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (customer) => {
    onChange(customer.name);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (!open) setOpen(true);
  };

  const handleAddNew = async () => {
    if (!searchValue.trim()) return;

    setAdding(true);
    try {
      const res = await api.post(apiUrl, "addCustomer", { name: searchValue.trim() });
      if (res.error) {
        alert(res.error);
      } else {
        onChange(searchValue.trim());
        setOpen(false);
        if (onCustomerAdded) onCustomerAdded(res.customer);
      }
    } catch (err) {
      alert("Failed to add customer: " + err.message);
    }
    setAdding(false);
  };

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="custom-select" ref={ref}>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || "Type or select..."}
          style={{ width: '100%', padding: '10px 12px', border: '0.5px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: '14px', outline: 'none' }}
        />
        {open && (filtered.length > 0 || searchValue) && (
          <div className="custom-select-dropdown">
            {filtered.map((o, i) => (
              <div key={i} className="custom-select-option" onClick={() => handleSelect(o)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{o.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.id}</span>
                </div>
              </div>
            ))}
            {searchValue && filtered.length === 0 && (
              <div className="custom-select-option" onClick={handleAddNew} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {adding ? "Adding..." : <>{Icons.plus} Add "{searchValue}" as new customer</>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TOAST ──
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ── HELPER FUNCTIONS ──
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateOnly === todayStr) {
    return 'Today';
  } else if (dateOnly === yesterdayStr) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// ── API HELPER ──
const api = {
  async get(url, action) {
    const res = await fetch(`${url}?action=${action}`, {
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return res.json();
  },
  async post(url, action, data) {
    const res = await fetch(`${url}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data),
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid response: ${text.substring(0, 100)}`);
    }
  }
};

// ── SALES ENTRY VIEW ──
function SalesEntry({ apiUrl, products, salespersons, customers, onSubmitSuccess, showToast, onCustomerAdded }) {
  const [salesperson, setSalesperson] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const addItem = (product, qty) => {
    const existing = items.findIndex(i => i.productId === product.id);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing].qty += qty;
      setItems(updated);
    } else {
      setItems([...items, { productId: product.id, productName: product.name, qty, unitPrice: product.sellingPrice, unit: product.unit }]);
    }
    setShowAddItem(false);
  };

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!salesperson || !invoiceNo || !customer || items.length === 0) {
      showToast("Please fill all fields and add at least one item", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(apiUrl, "submitSale", { invoiceNo, date, customer, salesperson, items, remarks });
      if (res.error) throw new Error(res.error);
      showToast(`${invoiceNo} submitted — ${res.itemCount} items, ${formatCurrency(res.total)}`, "success");
      setInvoiceNo("");
      setCustomer("");
      setRemarks("");
      setItems([]);
      onSubmitSuccess?.();
    } catch (err) {
      showToast("Submit failed: " + err.message, "error");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="card">
        <div className="card-title">Invoice Details</div>
        <Select label="Salesperson" value={salesperson} onChange={setSalesperson}
          options={salespersons.map(s => ({ label: `${s.name} · ${s.role}`, value: s.name }))} placeholder="Who is entering this?" />
        <div className="field">
          <label>Invoice Number</label>
          <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="e.g. INV-009" />
        </div>
        <div className="field">
          <label>Invoice Date · {formatDate(date)}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <ComboBox
          label="Customer"
          value={customer}
          onChange={setCustomer}
          options={customers}
          placeholder="Type or select customer..."
          apiUrl={apiUrl}
          onCustomerAdded={(newCustomer) => {
            showToast(`Customer "${newCustomer.name}" added (${newCustomer.id})`, "success");
            if (onCustomerAdded) onCustomerAdded(newCustomer);
          }}
        />
      </div>

      <div className="card">
        <div className="card-title">Line Items ({items.length})</div>
        {items.length === 0 && (
          <div className="empty-state">
            <div className="icon">{Icons.box}</div>
            <p>No items added yet</p>
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="line-item">
            <div className="line-item-info">
              <div className="line-item-name">{item.productName}</div>
              <div className="line-item-meta">{item.qty} {item.unit} × {formatCurrency(item.unitPrice)}</div>
            </div>
            <div className="line-item-amount">{formatCurrency(item.qty * item.unitPrice)}</div>
            <button className="line-item-remove" onClick={() => removeItem(idx)}>{Icons.trash}</button>
          </div>
        ))}
        {items.length > 0 && (
          <div className="total-bar">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatCurrency(total)}</span>
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <button className="add-item-btn" onClick={() => setShowAddItem(true)}>
            {Icons.plus} Add Item
          </button>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 12 }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Remarks (optional)</label>
            <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
      </div>

      <button className="btn btn-success" onClick={handleSubmit} disabled={submitting || items.length === 0}>
        {submitting ? <div className="spinner" /> : Icons.send}
        {submitting ? "Submitting..." : `Submit Invoice · ${formatCurrency(total)}`}
      </button>

      {showAddItem && (
        <AddItemSheet products={products} onAdd={addItem} onClose={() => setShowAddItem(false)} existingItems={items} />
      )}
    </>
  );
}

// ── ADD ITEM BOTTOM SHEET ──
function AddItemSheet({ products, onAdd, onClose, existingItems }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const existing = existingItems.find(i => i.productId === selected?.id);

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bottom-sheet">
        <div className="sheet-handle" />
        {!selected ? (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Select Product</h3>
            <input className="search-input" placeholder="Search by name, ID, or SKU..." value={search}
              onChange={e => setSearch(e.target.value)} autoFocus />
            <div style={{ maxHeight: "50vh", overflowY: "auto", margin: "0 -20px", padding: "0 20px" }}>
              {filtered.map(p => (
                <div key={p.id} className="product-option" onClick={() => setSelected(p)}>
                  <div>
                    <div className="product-option-name">{p.name}</div>
                    <div className="product-option-meta">{p.id} · {p.sku} · {p.unit}</div>
                  </div>
                  <div className="product-option-price">{formatCurrency(p.sellingPrice)}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="empty-state"><p>No products found</p></div>}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{selected.name}</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              {selected.id} · {formatCurrency(selected.sellingPrice)} / {selected.unit}
              {existing && <span style={{ color: "var(--warning)" }}> · {existing.qty} already in cart</span>}
            </p>
            <div className="field">
              <label>Quantity</label>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <input className="qty-input" type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "12px 0", fontFamily: "var(--mono)" }}>
              Subtotal: <strong>{formatCurrency(qty * selected.sellingPrice)}</strong>
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setSelected(null); setQty(1); }}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => onAdd(selected, qty)}>
                {Icons.plus} Add to Invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD VIEW ──
function Dashboard({ apiUrl, showToast, active }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(apiUrl, "getDashboard");
      if (res.error) throw new Error(res.error);
      setData(res);
      setHasLoaded(true);
    } catch (err) {
      showToast("Failed to load dashboard: " + err.message, "error");
    }
    setLoading(false);
  }, [apiUrl, showToast]);

  // Only load when tab becomes active for the first time
  useEffect(() => {
    if (apiUrl && active && !hasLoaded) load();
  }, [apiUrl, active, hasLoaded, load]);

  if (!apiUrl) return <div className="empty-state"><p>Set your API URL in Settings first</p></div>;
  if (loading) return <div className="empty-state"><div className="spinner" style={{ margin: "0 auto", borderColor: "var(--border-strong)", borderTopColor: "var(--accent)" }} /></div>;
  if (!data) return null;

  const { kpi, items, topCustomers } = data;
  const lowItems = items.filter(i => i.status === "LOW");
  const okItems = items.filter(i => i.status === "OK");
  const sorted = [...lowItems, ...okItems];

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total SKUs</div>
          <div className="kpi-value">{kpi.totalSKUs}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Stock on Hand</div>
          <div className="kpi-value">{kpi.totalOnHand.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low Stock</div>
          <div className={`kpi-value ${kpi.lowStockCount > 0 ? 'danger' : ''}`}>{kpi.lowStockCount}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value success">${kpi.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      {topCustomers && topCustomers.length > 0 && (
        <div className="card">
          <div className="card-title">Top Customers</div>
          {topCustomers.map((customer, idx) => (
            <div key={idx} className="stock-row">
              <div className="stock-name">
                {customer.name}
                <span>{customer.invoiceCount} {customer.invoiceCount === 1 ? 'invoice' : 'invoices'}</span>
              </div>
              <div className="stock-qty" style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--success)' }}>
                {formatCurrency(customer.totalPurchases)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-title">Stock Levels ({items.length} products)</div>
        {sorted.map(item => (
          <div key={item.id} className="stock-row">
            <div className="stock-name">
              {item.name}
              <span>{item.id} · In: {item.totalIn} · Out: {item.totalOut}</span>
            </div>
            <div className="stock-qty">{item.onHand}</div>
            <div className={`stock-badge ${item.status === "LOW" ? "low" : "ok"}`}>
              {item.status === "LOW" ? "⚠ LOW" : "✓ OK"}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary" onClick={load} style={{ marginTop: 4 }}>Refresh Dashboard</button>
    </>
  );
}

// ── HISTORY VIEW ──
function History({ apiUrl, showToast, refreshKey, active }) {
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(apiUrl, "getRecentSales");
      if (res.error) throw new Error(res.error);
      setAllSales(res.sales || []);
      setSales(res.sales || []);
      setHasLoaded(true);
    } catch (err) {
      showToast("Failed to load history: " + err.message, "error");
    }
    setLoading(false);
  }, [apiUrl, showToast]);

  // Load when tab becomes active or when refreshKey changes
  useEffect(() => {
    if (apiUrl && active && (!hasLoaded || refreshKey > 0)) load();
  }, [apiUrl, active, hasLoaded, refreshKey, load]);

  // Filter sales based on date range and search
  useEffect(() => {
    let filtered = [...allSales];

    // Date filtering
    if (startDate) {
      filtered = filtered.filter(inv => inv.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(inv => inv.date <= endDate);
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoiceNo.toLowerCase().includes(query) ||
        inv.customer.toLowerCase().includes(query) ||
        inv.salesperson.toLowerCase().includes(query)
      );
    }

    setSales(filtered);
  }, [startDate, endDate, searchQuery, allSales]);

  if (!apiUrl) return <div className="empty-state"><p>Set your API URL in Settings first</p></div>;
  if (loading) return <div className="empty-state"><div className="spinner" style={{ margin: "0 auto", borderColor: "var(--border-strong)", borderTopColor: "var(--accent)" }} /></div>;

  return (
    <>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">Filter & Search</div>
        <div className="field">
          <label>Search</label>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Invoice, customer, or salesperson..."
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        {(startDate || endDate || searchQuery) && (
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={() => { setStartDate(""); setEndDate(""); setSearchQuery(""); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {sales.length === 0 && <div className="empty-state"><p>No sales found</p></div>}
      {sales.map(inv => (
        <div key={inv.invoiceNo} className="invoice-card">
          <div className="invoice-header">
            <div>
              <div className="invoice-id">{inv.invoiceNo}</div>
              <div className="invoice-meta">{formatDate(inv.date)} · {inv.customer} · {inv.salesperson}</div>
            </div>
            <div className="invoice-total">{formatCurrency(inv.total)}</div>
          </div>
          <div className="invoice-items">
            {inv.items.map((item, idx) => (
              <div key={idx} className="invoice-item-row">
                <span>{item.productName} × {item.qty}</span>
                <span>{formatCurrency(item.lineTotal)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}


// ── MAIN APP ──
export default function App() {
  const [tab, setTab] = useState("sales");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [connected, setConnected] = useState(false);
  const [products, setProducts] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  const testConnection = async (url) => {
    try {
      // Single batched API call instead of 3 separate calls
      const res = await api.get(url, "getInitialData");
      if (res.error) throw new Error(res.error);
      setProducts(res.products || []);
      setSalespersons(res.salespersons || []);
      setCustomers(res.customers || []);
      setConnected(true);
    } catch (err) {
      setConnected(false);
      showToast("Connection failed: " + err.message, "error");
    }
  };

  useEffect(() => {
    if (apiUrl && !connected) testConnection(apiUrl);
  }, []);

  const tabs = [
    { id: "sales", label: "New Sale", icon: Icons.cart },
    { id: "dashboard", label: "Stock", icon: Icons.chart },
    { id: "history", label: "History", icon: Icons.clock },
  ];

  const titles = {
    sales: ["New Sale Entry", "Create invoice & record items sold"],
    dashboard: ["Stock Dashboard", "Real-time inventory levels"],
    history: ["Sales History", "Recent invoices submitted"],
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="app-header">
          <h1>{titles[tab][0]}</h1>
          <div className="subtitle">{titles[tab][1]}</div>
        </div>

        <div className="content">
          {tab === "sales" && (
            connected ? (
              <SalesEntry
                apiUrl={apiUrl}
                products={products}
                salespersons={salespersons}
                customers={customers}
                onSubmitSuccess={() => setRefreshKey(k => k + 1)}
                showToast={showToast}
                onCustomerAdded={(newCustomer) => {
                  setCustomers(prev => [...prev, newCustomer]);
                }}
              />
            ) : (
              <div className="empty-state">
                <div className="icon">⚙️</div>
                <p>Connecting to your Google Sheet...</p>
              </div>
            )
          )}
          {tab === "dashboard" && <Dashboard apiUrl={apiUrl} showToast={showToast} active={tab === "dashboard"} />}
          {tab === "history" && <History apiUrl={apiUrl} showToast={showToast} refreshKey={refreshKey} active={tab === "history"} />}
        </div>

        <div className="bottom-nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
