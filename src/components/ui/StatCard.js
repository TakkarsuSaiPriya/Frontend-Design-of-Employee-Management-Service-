export function StatCard({ label, value, color, delay }) {
  return (
    <div className={`card fade-up-${delay}`} style={{
      padding:"24px 26px", cursor:"default",
      transition:"border-color 0.2s, transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
    >
      <p style={{ fontSize:11, color:"var(--text-3)", fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
      <p style={{ fontSize:32, fontWeight:700, color:"var(--text-1)", lineHeight:1 }}>{value}</p>
    </div>
  );
}
