import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Spinner } from "../components/ui/Spinner";
import { FieldError } from "../components/ui/FieldError";

export function AuthPage({ onLogin, showToast }) {
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
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (tab === "register") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username.trim()))
        newErrors.username = "Please enter a valid email address (e.g. user@mail.com)";
    } else {
      if (form.username.trim().length < 3) newErrors.username = "At least 3 characters required";
    }
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
    setTab(t); setErrors({});
    setForm({ username:"", password:"", confirmPassword:"", role:"USER" });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", position:"relative", overflow:"hidden" }}>
      <div style={{ flex:"0 0 52%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background: dark ? "#1c2236" : "#1e3a8a", padding:"60px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", bottom:0, right:0, width:0, height:0, borderStyle:"solid", borderWidth:"0 0 180px 180px", borderColor:`transparent transparent ${dark?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.04)"} transparent`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, width:0, height:0, borderStyle:"solid", borderWidth:"120px 120px 0 0", borderColor:`${dark?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.04)"} transparent transparent transparent`, pointerEvents:"none" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24, zIndex:1 }}>
          <div style={{ width:80, height:80, borderRadius:22, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="16" cy="16" r="7" fill="rgba(255,255,255,0.95)"/>
              <circle cx="32" cy="16" r="5" fill="rgba(255,255,255,0.5)"/>
              <path d="M2 40c0-7.7 6.3-13 14-13s14 5.3 14 13" stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M32 27c4.5 0 10 2.8 10 9" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:"#ffffff", fontSize:26, fontWeight:700, letterSpacing:"-0.5px", marginBottom:8 }}>EMS Portal</p>
            <div style={{ width:32, height:2, background:"rgba(255,255,255,0.25)", borderRadius:99, margin:"0 auto 12px" }} />
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:400 }}>Employee Management System</p>
          </div>
        </div>
      </div>
      <div style={{ flex:"0 0 45%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 48px", position:"relative", background:"var(--bg)", overflowY:"auto" }}>
        <div style={{ position:"absolute", top:24, right:24 }}><ThemeToggle /></div>
        <div style={{ width:"100%", maxWidth:380 }} className="fade-up">
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:24, fontWeight:600, letterSpacing:"-0.5px", marginBottom:6 }}>{tab==="login" ? "Welcome back" : "Create account"}</h2>
            <p style={{ fontSize:14, color:"var(--text-3)" }}>{tab==="login" ? "Sign in to access your dashboard" : "Fill in the details to get started"}</p>
          </div>
          <div style={{ display:"flex", background:"var(--bg-3)", borderRadius:"var(--radius-md)", padding:3, marginBottom:28, gap:3 }}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>switchTab(t)} style={{ flex:1, padding:"9px 0", border:"none", borderRadius:"var(--radius-sm)", background:tab===t?"var(--bg-2)":"transparent", color:tab===t?"var(--text-1)":"var(--text-3)", fontSize:13, fontWeight:tab===t?500:400, cursor:"pointer", transition:"all 0.2s", boxShadow:tab===t?"var(--shadow-sm)":"none" }}>
                {t==="login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label className="label">{tab === "register" ? "Email Address" : "Username"}</label>
              <input name="username" value={form.username} onChange={handle} placeholder={tab === "register" ? "e.g. user@company.com" : "Enter your username"} className={errors.username ? "error" : ""} />
              <FieldError msg={errors.username} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handle} placeholder="Min 8 chars, A-Z, a-z, 0-9, !@#" onKeyDown={e=>e.key==="Enter"&&submit()} className={errors.password ? "error" : ""} />
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
            {tab==="register" && (
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="Re-enter your password" className={errors.confirmPassword ? "error" : ""} />
                <FieldError msg={errors.confirmPassword} />
              </div>
            )}
            {tab==="register" && (
              <div>
                <label className="label">Role</label>
                <select name="role" value={form.role} onChange={handle}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
            <button className="btn-primary" onClick={submit} disabled={loading} style={{ width:"100%", padding:"13px", fontSize:15, marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? <><Spinner /> Please wait...</> : tab==="login" ? "Sign In" : "Create Account"}
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:24, fontSize:12, color:"var(--text-3)" }}>Employee Management System</p>
        </div>
      </div>
    </div>
  );
}
