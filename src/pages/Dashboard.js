import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, getDept, getRoleFromToken } from "../constants";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { StatCard } from "../components/ui/StatCard";
import { EmployeeModal } from "../components/employee/EmployeeModal";
import { DeleteModal } from "../components/employee/DeleteModal";

export function Dashboard({ username, onLogout, showToast }) {
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
          <span style={{ fontWeight:700, fontSize:15, letterSpacing:"-0.3px" }}>EMS Portal</span>
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
          <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:"-0.5px", marginBottom:4 }}>Employee Dashboard</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}></p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px,1fr))", gap:14, marginBottom:28 }}>
          <StatCard label="Total Employees" value={employees.length}                                 color="var(--accent)" delay="1" />
          <StatCard label="Active"           value={employees.filter(e=>e.status==="ACTIVE").length} color="var(--green)" delay="2" />
          <StatCard label="Departments"      value={Object.keys(deptCounts).length}                  color="var(--purple)" delay="3" />
          <StatCard label="Top Dept"         value={topDept}                                          color="var(--amber)" delay="4" />
        </div>
        <div className="card fade-up-2" style={{ overflow:"hidden" }}>
          <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:160 }}>
              <h2 style={{ fontSize:15, fontWeight:600, marginBottom:1 }}>Employees</h2>
              <p style={{ fontSize:12, color:"var(--text-3)" }}>{filtered.length} records</p>
            </div>
            <div style={{ position:"relative" }}>
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
                          <span className="tag" style={{ background:`${dept.color}15`, color:dept.color, border:`1px solid ${dept.color}25` }}>{emp.department}</span>
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
                              {[
                                {label:"Edit",   action:()=>setModal(emp),        bg:"var(--accent-dim)", color:"var(--accent)", hoverBg:"rgba(37,99,235,0.15)"},
                                {label:"Delete", action:()=>setDeleteTarget(emp), bg:"var(--red-dim)",    color:"var(--red)",    hoverBg:"rgba(220,38,38,0.15)"},
                              ].map(({label,action,bg,color,hoverBg})=>(
                                <button key={label} onClick={action} style={{ background:bg, color:color, border:"none", borderRadius:"var(--radius-sm)", padding:"5px 12px", fontSize:12, fontWeight:500, cursor:"pointer", transition:"background 0.15s" }}
                                  onMouseEnter={e=>e.currentTarget.style.background=hoverBg}
                                  onMouseLeave={e=>e.currentTarget.style.background=bg}
                                >{label}</button>
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
