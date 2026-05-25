export function DeleteModal({ employee, onClose, onConfirm }) {
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:400, textAlign:"center" }}>
        <div style={{ width:52, height:52, margin:"0 auto 18px", background:"var(--red-dim)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h2 style={{ fontSize:20, fontWeight:600, marginBottom:8 }}>Delete Employee?</h2>
        <p style={{ fontSize:14, color:"var(--text-2)", marginBottom:4, lineHeight:1.6 }}>You are about to permanently delete</p>
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
