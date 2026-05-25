import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import { Toast } from "./components/ui/Toast";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";

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
