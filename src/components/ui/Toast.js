import { useEffect } from "react";

export function Toast({ message, type, onClose }) {
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
      <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text-3)",fontSize:18,lineHeight:1,padding:2 }}>x</button>
    </div>
  );
}
