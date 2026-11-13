// Sistema de acceso de Kripta (versión inicial)
// TODO: mover la validación al servidor
const USERS = [
  { email: "admin@kripta.test",  password: "Kripta2024!", role: "admin" },
  { email: "laura@kripta.test",  password: "Laura123",    role: "auditor" },
  { email: "pau@kripta.test",    password: "pau2023",     role: "auditor" }
];

function login(email, password) {
  const user = USERS.find(u => u.email === email);
  if (!user) return { ok: false, error: "El usuario no existe." };
  if (user.password !== password) return { ok: false, error: "Contraseña incorrecta." };
  localStorage.setItem("kripta_session", btoa(JSON.stringify({ email: user.email, role: user.role })));
  return { ok: true };
}

function getSession() {
  try { return JSON.parse(atob(localStorage.getItem("kripta_session"))); }
  catch (e) { return null; }
}

function logout() {
  localStorage.removeItem("kripta_session");
  location.href = "login.html";
}
