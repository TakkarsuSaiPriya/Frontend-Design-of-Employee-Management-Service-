export function GlobalStyles({ dark }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:         ${dark ? "#13161e"  : "#f8f9fc"};
      --bg-2:       ${dark ? "#1c2030"  : "#ffffff"};
      --bg-3:       ${dark ? "#242840"  : "#f1f3f9"};
      --bg-4:       ${dark ? "#2d3250"  : "#e4e8f2"};
      --border:     ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"};
      --border-hover:${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.16)"};
      --text-1:     ${dark ? "#e8ecf8"  : "#0d1117"};
      --text-2:     ${dark ? "#8f97b8"  : "#505878"};
      --text-3:     ${dark ? "#555e7e"  : "#a0a8c0"};
      --accent:     ${dark ? "#6b9fff"  : "#2563eb"};
      --accent-dim: ${dark ? "rgba(107,159,255,0.15)" : "rgba(37,99,235,0.08)"};
      --accent-glow:${dark ? "rgba(107,159,255,0.25)" : "rgba(37,99,235,0.2)"};
      --green:      ${dark ? "#4ade80"  : "#059669"};
      --green-dim:  ${dark ? "rgba(74,222,128,0.15)"  : "rgba(5,150,105,0.08)"};
      --red:        ${dark ? "#fb7185"  : "#dc2626"};
      --red-dim:    ${dark ? "rgba(251,113,133,0.15)" : "rgba(220,38,38,0.08)"};
      --amber:      ${dark ? "#fcd34d"  : "#d97706"};
      --amber-dim:  ${dark ? "rgba(252,211,77,0.15)"  : "rgba(217,119,6,0.08)"};
      --purple:     ${dark ? "#c084fc"  : "#7c3aed"};
      --purple-dim: ${dark ? "rgba(192,132,252,0.15)" : "rgba(124,58,237,0.08)"};
      --shadow-sm:  ${dark ? "0 1px 4px rgba(0,0,0,0.4)"  : "0 1px 4px rgba(37,99,235,0.08)"};
      --shadow-md:  ${dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 24px rgba(37,99,235,0.1)"};
      --shadow-lg:  ${dark ? "0 8px 36px rgba(0,0,0,0.5)" : "0 8px 48px rgba(37,99,235,0.14)"};
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
  `;
  return <style>{css}</style>;
}
