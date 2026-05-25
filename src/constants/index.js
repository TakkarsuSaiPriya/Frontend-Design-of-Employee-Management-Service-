export const BASE_URL = "http://localhost:8081";

export const DEPT = {
  Engineering:{color:"#3b82f6"}, HR:{color:"#8b5cf6"},
  Sales:{color:"#f59e0b"},       QA:{color:"#10b981"},
  IT:{color:"#ec4899"},          Finance:{color:"#f97316"},
};

export const getDept = (d) => DEPT[d] || { color:"#3b82f6" };

export function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return 'USER';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'USER';
  } catch { return 'USER'; }
}
