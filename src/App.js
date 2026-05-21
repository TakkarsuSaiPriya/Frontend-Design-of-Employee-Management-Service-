import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8081";

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const toggle = () => setDark(d => { localStorage.setItem("theme", !d ? "dark" : "light"); return !d; });
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

function GlobalStyles({ dark }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:         ${dark ? "#060810"  : "#f0f4ff"};
      --bg-2:       ${dark ? "#0d1117"  : "#ffffff"};
      --bg-3:       ${dark ? "#161b27"  : "#f4f6fc"};
      --bg-4:       ${dark ? "#1e2535"  : "#e8ecf7"};
      --border:     ${dark ? "rgba(255,255,255,0.06)" : "rgba(99,120,220,0.12)"};
      --border-hover:${dark ? "rgba(255,255,255,0.12)" : "rgba(99,120,220,0.25)"};
      --text-1:     ${dark ? "#f0f4ff"  : "#0f1623"};
      --text-2:     ${dark ? "#8892aa"  : "#4a5578"};
      --text-3:     ${dark ? "#3d4a63"  : "#9aa3bb"};
      --accent:     ${dark ? "#4f8ef7"  : "#2563eb"};
      --accent-dim: ${dark ? "rgba(79,142,247,0.12)"  : "rgba(37,99,235,0.08)"};
      --accent-glow:${dark ? "rgba(79,142,247,0.25)"  : "rgba(37,99,235,0.2)"};
      --green:      ${dark ? "#34d399"  : "#059669"};
      --green-dim:  ${dark ? "rgba(52,211,153,0.12)"  : "rgba(5,150,105,0.08)"};
      --red:        ${dark ? "#f87171"  : "#dc2626"};
      --red-dim:    ${dark ? "rgba(248,113,113,0.12)" : "rgba(220,38,38,0.08)"};
      --amber:      ${dark ? "#fbbf24"  : "#d97706"};
      --amber-dim:  ${dark ? "rgba(251,191,36,0.12)"  : "rgba(217,119,6,0.08)"};
      --purple:     ${dark ? "#a78bfa"  : "#7c3aed"};
      --purple-dim: ${dark ? "rgba(167,139,250,0.12)" : "rgba(124,58,237,0.08)"};
      --shadow-sm:  ${dark ? "0 1px 3px rgba(0,0,0,0.4)"  : "0 1px 4px rgba(37,99,235,0.08)"};
      --shadow-md:  ${dark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 24px rgba(37,99,235,0.1)"};
      --shadow-lg:  ${dark ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 48px rgba(37,99,235,0.14)"};
      --radius-sm:6px; --radius-md:10px; --radius-lg:16px; --radius-xl:20px;
      --font:'DM Sans',sans-serif; --font-mono:'DM Mono',monospace;
    }
    body { font-family:var(--font); background:var(--bg); color:var(--text-1); -webkit-font-smoothing:antialiased; min-height:100vh; transition:background 0.3s,color 0.3s; }
    ::-webkit-scrollbar{width:5px;height:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:var(--bg-4);border-radius:99px;}
    @keyframes fadeUp    {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn    {from{opacity:0}to{opacity:1}}
    @keyframes slideRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse     {0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes spin      {to{transform:rotate(360deg)}}
    @keyframes float     {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes floatSlow {0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(3deg)}}
    @keyframes drift     {0%,100%{transform:translate(0,0)}33%{transform:translate(12px,-8px)}66%{transform:translate(-8px,10px)}}
    .fade-up  {animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}
    .fade-up-1{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both}
    .fade-up-2{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both}
    .fade-up-3{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both}
    .fade-up-4{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both}
    input,select{font-family:var(--font);background:var(--bg-3);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-1);font-size:14px;padding:10px 14px;outline:none;width:100%;transition:border-color 0.2s,box-shadow 0.2s,background 0.3s;}
    input:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow);}
    input::placeholder{color:var(--text-3);}
    input.error{border-color:var(--red) !important;}
    input.error:focus{box-shadow:0 0 0 3px var(--red-dim) !important;}
    select option{background:var(--bg-2);color:var(--text-1);}
    button{font-family:var(--font);cursor:pointer;}
    .btn-primary{background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);padding:10px 20px;font-size:14px;font-weight:500;transition:opacity 0.2s,transform 0.1s,box-shadow 0.2s;box-shadow:0 0 20px var(--accent-glow);}
    .btn-primary:hover{opacity:0.9;} .btn-primary:active{transform:scale(0.98);} .btn-primary:disabled{opacity:0.4;cursor:not-allowed;}
    .btn-ghost{background:transparent;color:var(--text-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:10px 20px;font-size:14px;transition:background 0.2s,border-color 0.2s,color 0.2s;}
    .btn-ghost:hover{background:var(--bg-3);border-color:var(--border-hover);color:var(--text-1);}
    .btn-danger{background:var(--red-dim);color:var(--red);border:1px solid rgba(220,38,38,0.2);border-radius:var(--radius-md);padding:10px 20px;font-size:14px;font-weight:500;transition:filter 0.2s;}
    .btn-danger:hover{filter:brightness(1.1);}
    .card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);transition:background 0.3s,border-color 0.3s;}
    .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;font-family:var(--font-mono);}
    .row-tr{border-bottom:1px solid var(--border);transition:background 0.15s;}
    .row-tr:hover{background:var(--bg-3);} .row-tr:last-child{border-bottom:none;}
    .overlay{position:fixed;inset:0;background:${dark?"rgba(6,8,16,0.85)":"rgba(15,23,42,0.55)"};backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn 0.2s ease;}
    .modal{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-xl);padding:32px;width:100%;max-width:480px;box-shadow:var(--shadow-lg);animation:fadeUp 0.3s cubic-bezier(0.16,1,0.3,1);}
    .label{display:block;font-size:12px;font-weight:500;color:var(--text-2);margin-bottom:6px;letter-spacing:0.04em;text-transform:uppercase;}
    .field-error{color:var(--red);font-size:12px;margin-top:5px;display:flex;align-items:center;gap:4px;}
    .theme-toggle{position:relative;width:48px;height:26px;background:var(--bg-4);border:1px solid var(--border);border-radius:99px;cursor:pointer;transition:background 0.3s;}
    .theme-toggle-thumb{position:absolute;top:3px;width:18px;height:18px;background:var(--accent);border-radius:50%;transition:left 0.3s cubic-bezier(0.34,1.56,0.64,1);display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);}
  `;
  return <style>{css}</style>;
}

const DEPT = {
  Engineering:{color:"#4f8ef7",icon:"⚙️"}, HR:{color:"#a78bfa",icon:"🤝"},
  Sales:{color:"#fbbf24",icon:"📈"},       QA:{color:"#34d399",icon:"🔍"},
  IT:{color:"#f472b6",icon:"💻"},          Finance:{color:"#fb923c",icon:"💰"},
};
const getDept = (d) => DEPT[d] || { color:"#4f8ef7", icon:"🏢" };

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} className="theme-toggle" title={dark?"Switch to Light":"Switch to Dark"}>
      <div className="theme-toggle-thumb" style={{ left: dark ? "26px" : "3px" }}>
        {dark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success:{bg:"var(--green-dim)", border:"rgba(52,211,153,0.25)",  color:"var(--green)",  icon:"✓"},
    error:  {bg:"var(--red-dim)",   border:"rgba(220,38,38,0.25)",   color:"var(--red)",    icon:"✕"},
    info:   {bg:"var(--accent-dim)",border:"var(--accent-glow)",     color:"var(--accent)", icon:"i"},
  }[type] || {};
  return (
    <div style={{ position:"fixed",bottom:28,right:28,zIndex:9999,background:cfg.bg,border:`1px solid ${cfg.border}`,borderRadius:"var(--radius-lg)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,boxShadow:"var(--shadow-lg)",maxWidth:340,minWidth:260,backdropFilter:"blur(12px)",animation:"slideRight 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ width:28,height:28,borderRadius:"50%",background:`${cfg.color}20`,display:"flex",alignItems:"center",justifyContent:"center",color:cfg.color,fontSize:13,fontWeight:700,flexShrink:0 }}>{cfg.icon}</div>
      <span style={{ fontSize:14,color:"var(--text-1)",flex:1,lineHeight:1.4 }}>{message}</span>
      <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text-3)",fontSize:18,lineHeight:1,padding:2 }}>×</button>
    </div>
  );
}

const Spinner = ({ size=14 }) => (
  <span style={{ width:size,height:size,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block" }} />
);

const FieldError = ({ msg }) => msg ? (
  <p className="field-error">⚠ {msg}</p>
) : null;

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, showToast }) {
  const { dark } = useTheme();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username:"", password:"", confirmPassword:"", role:"USER" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "At least 8 characters required";
    if (!/[A-Z]/.test(pwd)) return "Must include at least one uppercase letter (A-Z)";
    if (!/[a-z]/.test(pwd)) return "Must include at least one lowercase letter (a-z)";
    if (!/[0-9]/.test(pwd)) return "Must include at least one number (0-9)";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "Must include at least one special character (!@#$%^&*)";
    return "";
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.trim().length < 3) newErrors.username = "At least 3 characters required";
    else if (/\s/.test(form.username)) newErrors.username = "No spaces allowed";

    const pwdError = validatePassword(form.password);
    if (pwdError) newErrors.password = pwdError;

    if (tab === "register") {
      if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await axios.post(`${BASE_URL}/auth/login`, { username:form.username, password:form.password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", form.username);
        onLogin(res.data.token, form.username);
        showToast("Welcome back!", "success");
      } else {
        await axios.post(`${BASE_URL}/auth/register`, { username:form.username, password:form.password, role:form.role });
        showToast("Account created! Sign in now.","success");
        setTab("login");
        setForm({ username:"", password:"", confirmPassword:"", role:"USER" });
      }
    } catch (err) { showToast(err.response?.data?.error || "Invalid credentials","error"); }
    finally { setLoading(false); }
  };

  const switchTab = (t) => {
    setTab(t);
    setErrors({});
    setForm({ username:"", password:"", confirmPassword:"", role:"USER" });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", position:"relative", overflow:"hidden" }}>

      {/* LEFT PANEL */}
      <div style={{ flex:"0 0 55%", position:"relative", overflow:"hidden",
        background: dark ? "linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 40%, #0a1628 100%)" : "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #1d4ed8 100%)",
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", padding:"60px 64px" }}>

        <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage: dark
          ? "radial-gradient(ellipse at 20% 50%, rgba(79,142,247,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.12) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.2) 0%, transparent 50%)",
          pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"8%", right:"12%", width:280, height:280, borderRadius:"50%", background:dark?"rgba(79,142,247,0.08)":"rgba(255,255,255,0.07)", animation:"float 7s ease-in-out infinite", zIndex:0, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"15%", left:"5%", width:200, height:200, borderRadius:"50%", background:dark?"rgba(167,139,250,0.07)":"rgba(255,255,255,0.06)", animation:"floatSlow 9s ease-in-out infinite", zIndex:0, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"-60px", right:"-60px", width:320, height:320, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.06)", zIndex:0, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:360, height:360, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.04)", zIndex:0, pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:52 }}>
            <div style={{ width:40, height:40, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👥</div>
            <span style={{ color:"rgba(255,255,255,0.9)", fontWeight:600, fontSize:16 }}>EMS Portal</span>
          </div>
          <h1 style={{ fontSize:42, fontWeight:700, color:"#ffffff", lineHeight:1.15, letterSpacing:"-1px", marginBottom:20, maxWidth:420 }}>
            Manage your<br />
            <span style={{ background:"linear-gradient(90deg, #93c5fd, #c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>workforce</span>{" "}smarter.
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.7, maxWidth:380, marginBottom:48, fontWeight:300 }}>
            A centralized platform to track, manage, and grow your team — built for modern organizations.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[{icon:"⚡",text:"Real-time employee tracking"},{icon:"🔒",text:"JWT-secured access control"},{icon:"📊",text:"Department analytics at a glance"}].map(({icon,text})=>(
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, background:"rgba(255,255,255,0.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{icon}</div>
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:52, display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:99, padding:"8px 16px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#34d399", animation:"pulse 2s infinite" }} />
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontFamily:"var(--font-mono)" }}>System Online — v1.0</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex:"0 0 45%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 48px", position:"relative", background:"var(--bg)", overflowY:"auto" }}>
        <div style={{ position:"absolute", top:24, right:24 }}><ThemeToggle /></div>

        <div style={{ width:"100%", maxWidth:380 }} className="fade-up">
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:24, fontWeight:600, letterSpacing:"-0.5px", marginBottom:6 }}>
              {tab==="login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ fontSize:14, color:"var(--text-3)" }}>
              {tab==="login" ? "Sign in to access your dashboard" : "Fill in the details to get started"}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", background:"var(--bg-3)", borderRadius:"var(--radius-md)", padding:3, marginBottom:28, gap:3 }}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>switchTab(t)} style={{ flex:1, padding:"9px 0", border:"none", borderRadius:"var(--radius-sm)", background:tab===t?"var(--bg-2)":"transparent", color:tab===t?"var(--text-1)":"var(--text-3)", fontSize:13, fontWeight:tab===t?500:400, cursor:"pointer", transition:"all 0.2s", boxShadow:tab===t?"var(--shadow-sm)":"none" }}>
                {t==="login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Username */}
            <div>
              <label className="label">Username</label>
              <input name="username" value={form.username} onChange={handle} placeholder="Enter your username"
                className={errors.username ? "error" : ""} />
              <FieldError msg={errors.username} />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handle}
                placeholder="Min 8 chars, A-Z, a-z, 0-9, !@#" onKeyDown={e=>e.key==="Enter"&&submit()}
                className={errors.password ? "error" : ""} />
              <FieldError msg={errors.password} />
              {tab==="register" && form.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[
                      { test: form.password.length >= 8, label:"8+ chars" },
                      { test: /[A-Z]/.test(form.password), label:"A-Z" },
                      { test: /[a-z]/.test(form.password), label:"a-z" },
                      { test: /[0-9]/.test(form.password), label:"0-9" },
                      { test: /[!@#$%^&*]/.test(form.password), label:"!@#" },
                    ].map(({test,label})=>(
                      <div key={label} style={{ flex:1, textAlign:"center" }}>
                        <div style={{ height:3, borderRadius:99, background:test?"var(--green)":"var(--bg-4)", marginBottom:3, transition:"background 0.2s" }} />
                        <span style={{ fontSize:9, color:test?"var(--green)":"var(--text-3)", fontFamily:"var(--font-mono)" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password - register only */}
            {tab==="register" && (
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle}
                  placeholder="Re-enter your password"
                  className={errors.confirmPassword ? "error" : ""} />
                <FieldError msg={errors.confirmPassword} />
              </div>
            )}

            {/* Role — register only */}
            {tab==="register" && (
              <div>
                <label className="label">Role</label>
                <select name="role" value={form.role} onChange={handle}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            <button className="btn-primary" onClick={submit} disabled={loading}
              style={{ width:"100%", padding:"13px", fontSize:15, marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? <><Spinner /> Please wait...</> : tab==="login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          <p style={{ textAlign:"center", marginTop:24, fontSize:12, color:"var(--text-3)" }}>
            Employee Management System · v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ── EMPLOYEE MODAL ────────────────────────────────────────────────────────────
function EmployeeModal({ employee, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({ name:employee?.name||"", email:employee?.email||"", department:employee?.department||"", dateOfJoining:employee?.dateOfJoining||"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!employee?.id;

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";
    else if (new Date(form.dateOfJoining) > new Date()) newErrors.dateOfJoining = "Date cannot be in the future";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildXml = () => `<Employee>\n  <name>${form.name}</name>\n  <email>${form.email}</email>\n  <department>${form.department}</department>\n  <dateOfJoining>${form.dateOfJoining}</dateOfJoining>\n</Employee>`;

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers:{ "Content-Type":"application/xml", Authorization:`Bearer ${token}` } };
      if (isEdit) { await axios.put(`${BASE_URL}/employees/${employee.id}`, buildXml(), config); showToast("Employee updated!","success"); }
      else         { await axios.post(`${BASE_URL}/employees`, buildXml(), config);               showToast("Employee added!","success"); }
      onSaved(); onClose();
    } catch { showToast("Failed to save employee","error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:600, marginBottom:4 }}>{isEdit?"Edit Employee":"Add Employee"}</h2>
            <p style={{ fontSize:13, color:"var(--text-3)" }}>{isEdit?"Update employee information":"Fill in the details below"}</p>
          </div>
          <button onClick={onClose} style={{ background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", color:"var(--text-2)", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>×</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[{label:"Full Name",name:"name",type:"text",placeholder:"e.g. Priya Sharma"},
            {label:"Email Address",name:"email",type:"email",placeholder:"priya@company.com"},
            {label:"Department",name:"department",type:"text",placeholder:"e.g. Engineering"},
            {label:"Date of Joining",name:"dateOfJoining",type:"date",placeholder:""},
          ].map(({label,name,type,placeholder})=>(
            <div key={name}>
              <label className="label">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder}
                className={errors[name]?"error":""} />
              <FieldError msg={errors[name]} />
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex:1 }}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={loading} style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading?<><Spinner />Saving...</>:isEdit?"Save Changes":"Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ employee, onClose, onConfirm }) {
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:400, textAlign:"center" }}>
        <div style={{ width:56, height:56, margin:"0 auto 20px", background:"var(--red-dim)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🗑️</div>
        <h2 style={{ fontSize:20, fontWeight:600, marginBottom:8 }}>Delete Employee?</h2>
        <p style={{ fontSize:14, color:"var(--text-2)", marginBottom:4, lineHeight:1.6 }}>You're about to permanently delete</p>
        <p style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>{employee.name}</p>
        <p style={{ fontSize:13, color:"var(--text-3)", marginBottom:28 }}>This action cannot be undone.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-ghost"  onClick={onClose}   style={{ flex:1 }}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} style={{ flex:1 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, delay }) {
  return (
    <div className={`card fade-up-${delay}`} style={{ padding:"20px 22px", display:"flex", alignItems:"center", gap:16, transition:"border-color 0.2s,transform 0.2s,box-shadow 0.2s", cursor:"default" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{ width:46, height:46, borderRadius:"var(--radius-md)", background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ fontSize:11, color:"var(--text-3)", fontWeight:500, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>
        <p style={{ fontSize:24, fontWeight:600, color, fontFamily:"var(--font-mono)", lineHeight:1 }}>{value}</p>
      </div>
    </div>
  );
}

function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return 'USER';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'USER';
  } catch { return 'USER'; }
}

function Dashboard({ username, onLogout, showToast }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const role = getRoleFromToken();
  const isAdmin = role === "ADMIN";
  const getConfig = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });
  const fetchAll = async () => {
    setLoading(true);
    try { const res = await axios.get(`${BASE_URL}/employees`, getConfig()); setEmployees(res.data); }
    catch { showToast("Failed to load employees","error"); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ fetchAll(); },[]);
  const handleDelete = async () => {
    try { await axios.delete(`${BASE_URL}/employees/${deleteTarget.id}`, getConfig()); showToast("Employee removed","success"); setDeleteTarget(null); fetchAll(); }
    catch { showToast("Delete failed","error"); }
  };
  const filtered = employees.filter(e=>[e.name,e.email,e.department].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
  const deptCounts = employees.reduce((acc,e)=>{ acc[e.department]=(acc[e.department]||0)+1; return acc; },{});
  const topDept = Object.entries(deptCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav style={{ background:"var(--bg-2)", borderBottom:"1px solid var(--border)", padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"var(--accent-dim)", border:"1px solid var(--border)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👥</div>
          <span style={{ fontWeight:600, fontSize:15, letterSpacing:"-0.2px" }}>EMS</span>
          <span style={{ marginLeft:4, fontSize:11, background:"var(--accent-dim)", color:"var(--accent)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 6px", fontFamily:"var(--font-mono)" }}>v1.0</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <ThemeToggle />
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 12px", background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)" }}>
            <div style={{ width:26, height:26, background:"var(--accent-dim)", border:"1px solid var(--border)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"var(--accent)" }}>{username?.[0]?.toUpperCase()}</div>
            <span style={{ color:"var(--text-2)", fontSize:13 }}>{username}</span>
            <span style={{ fontSize:10, background:isAdmin?"var(--amber-dim)":"var(--green-dim)", color:isAdmin?"var(--amber)":"var(--green)", border:`1px solid ${isAdmin?"rgba(217,119,6,0.2)":"rgba(5,150,105,0.2)"}`, borderRadius:4, padding:"2px 6px", fontFamily:"var(--font-mono)" }}>
              {isAdmin?"ADMIN":"USER"}
            </span>
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{ padding:"6px 14px", fontSize:13 }}>Sign out</button>
        </div>
      </nav>
      <div style={{ padding:"32px 28px", maxWidth:1200, margin:"0 auto" }}>
        <div className="fade-up" style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:"-0.5px", marginBottom:4 }}>Workforce Overview</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}>Manage and track your organization's employees</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px,1fr))", gap:14, marginBottom:28 }}>
          <StatCard label="Total Employees" value={employees.length}                                 color="var(--accent)" icon="👤" delay="1" />
          <StatCard label="Active"           value={employees.filter(e=>e.status==="ACTIVE").length} color="var(--green)"  icon="✓"  delay="2" />
          <StatCard label="Departments"      value={Object.keys(deptCounts).length}                  color="var(--purple)" icon="🏢" delay="3" />
          <StatCard label="Top Dept"         value={topDept}                                          color="var(--amber)"  icon="⭐" delay="4" />
        </div>
        <div className="card fade-up-2" style={{ overflow:"hidden" }}>
          <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:160 }}>
              <h2 style={{ fontSize:15, fontWeight:600, marginBottom:1 }}>Employees</h2>
              <p style={{ fontSize:12, color:"var(--text-3)" }}>{filtered.length} records</p>
            </div>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"var(--text-3)", pointerEvents:"none" }}>🔍</span>
              <input placeholder="Search employees..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34, width:220, background:"var(--bg-3)" }} />
            </div>
            {isAdmin && (
              <button className="btn-primary" onClick={()=>setModal("create")} style={{ display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add Employee
              </button>
            )}
            <button onClick={fetchAll} style={{ background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)", color:"var(--text-2)", padding:"10px 12px", fontSize:15, transition:"all 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
              title="Refresh">↻</button>
          </div>
          {loading ? (
            <div style={{ padding:"60px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <div style={{ width:32, height:32, border:"2px solid var(--bg-4)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              <p style={{ color:"var(--text-3)", fontSize:14 }}>Loading employees...</p>
            </div>
          ) : filtered.length===0 ? (
            <div style={{ padding:"60px 0", textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <p style={{ color:"var(--text-2)", fontSize:15, marginBottom:4 }}>{search?"No matching employees":"No employees yet"}</p>
              <p style={{ color:"var(--text-3)", fontSize:13 }}>{search?"Try a different search term":"Click 'Add Employee' to get started"}</p>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border)" }}>
                    {["#","Employee","Email","Department","Joined","Status",""].map((h,i)=>(
                      <th key={i} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:500, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap", background:"var(--bg-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp,i)=>{
                    const dept=getDept(emp.department);
                    return (
                      <tr key={emp.id} className="row-tr">
                        <td style={{ padding:"14px 16px", color:"var(--text-3)", fontSize:12, fontFamily:"var(--font-mono)" }}>{String(i+1).padStart(2,"0")}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <div style={{ width:36, height:36, borderRadius:"var(--radius-md)", background:`${dept.color}18`, border:`1px solid ${dept.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:dept.color, flexShrink:0, fontFamily:"var(--font-mono)" }}>{emp.name?.[0]?.toUpperCase()}</div>
                            <div>
                              <p style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>{emp.name}</p>
                              <p style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-mono)" }}>ID:{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"14px 16px", color:"var(--text-2)", fontSize:13 }}>{emp.email}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <span className="tag" style={{ background:`${dept.color}15`, color:dept.color, border:`1px solid ${dept.color}25` }}>{dept.icon} {emp.department}</span>
                        </td>
                        <td style={{ padding:"14px 16px", color:"var(--text-3)", fontSize:12, fontFamily:"var(--font-mono)" }}>{emp.dateOfJoining}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <span className="tag" style={{ background:emp.status==="ACTIVE"?"var(--green-dim)":"var(--red-dim)", color:emp.status==="ACTIVE"?"var(--green)":"var(--red)", border:`1px solid ${emp.status==="ACTIVE"?"rgba(52,211,153,0.2)":"rgba(220,38,38,0.2)"}` }}>
                            <span style={{ width:5, height:5, borderRadius:"50%", background:"currentColor", display:"inline-block", marginRight:5, animation:emp.status==="ACTIVE"?"pulse 2s infinite":"none" }} />
                            {emp.status}
                          </span>
                        </td>
                        <td style={{ padding:"14px 16px" }}>
                          {isAdmin && (
                            <div style={{ display:"flex", gap:6 }}>
                              {[{icon:"✏️",title:"Edit",action:()=>setModal(emp),hover:"var(--accent-dim)"},
                                {icon:"🗑️",title:"Delete",action:()=>setDeleteTarget(emp),hover:"var(--red-dim)"}
                              ].map(({icon,title,action,hover})=>(
                                <button key={title} onClick={action} title={title} style={{ background:"none", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"5px 8px", fontSize:14, transition:"all 0.15s" }}
                                  onMouseEnter={e=>{e.currentTarget.style.background=hover;e.currentTarget.style.borderColor="var(--border-hover)";}}
                                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.borderColor="var(--border)";}}
                                >{icon}</button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!loading&&employees.length>0&&(
            <div style={{ padding:"12px 22px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <p style={{ fontSize:12, color:"var(--text-3)" }}>Showing <span style={{ color:"var(--text-2)", fontFamily:"var(--font-mono)" }}>{filtered.length}</span> of <span style={{ color:"var(--text-2)", fontFamily:"var(--font-mono)" }}>{employees.length}</span> employees</p>
              <p style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-mono)" }}>Updated: {new Date().toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </div>
      {(modal==="create"||(modal&&modal.id))&&<EmployeeModal employee={modal==="create"?null:modal} onClose={()=>setModal(null)} onSaved={fetchAll} showToast={showToast}/>}
      {deleteTarget&&<DeleteModal employee={deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete}/>}
    </div>
  );
}

function AppContent() {
  const { dark } = useTheme();
  const [user, setUser] = useState(()=>{ const token=localStorage.getItem("token"); const username=localStorage.getItem("username"); return token?{token,username}:null; });
  const [toast, setToast] = useState(null);
  const showToast = (message, type="info") => setToast({ message, type });
  return (
    <>
      <GlobalStyles dark={dark} />
      {user
        ? <Dashboard username={user.username} onLogout={()=>{ localStorage.clear(); setUser(null); }} showToast={showToast} />
        : <AuthPage onLogin={(token,username)=>setUser({token,username})} showToast={showToast} />
      }
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}

export default function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>;
}
