import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} className="theme-toggle" title={dark?"Switch to Light":"Switch to Dark"} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)", cursor:"pointer", transition:"all 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round">
        {dark
          ? <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>
          : <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
        }
      </svg>
      <span style={{ fontSize:12, color:"var(--text-2)", fontWeight:500 }}>{dark ? "Dark" : "Light"}</span>
    </button>
  );
}
