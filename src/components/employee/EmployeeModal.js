import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { Spinner } from "../ui/Spinner";
import { FieldError } from "../ui/FieldError";

export function EmployeeModal({ employee, onClose, onSaved, showToast }) {
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
          <button onClick={onClose} style={{ background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", color:"var(--text-2)", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>x</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[{label:"Full Name",name:"name",type:"text",placeholder:"e.g. Priya Sharma"},
            {label:"Email Address",name:"email",type:"email",placeholder:"priya@company.com"},
            {label:"Department",name:"department",type:"text",placeholder:"e.g. Engineering"},
            {label:"Date of Joining",name:"dateOfJoining",type:"date",placeholder:""},
          ].map(({label,name,type,placeholder})=>(
            <div key={name}>
              <label className="label">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder} className={errors[name]?"error":""} />
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
