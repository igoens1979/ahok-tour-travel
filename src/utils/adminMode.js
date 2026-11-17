export const ADMIN_PASSWORD = "ahokadmin";

export function isAdminMode() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ahok_admin") === "1";
}

export function setAdminMode(value) {
  if (value) {
    localStorage.setItem("ahok_admin", "1");
  } else {
    localStorage.removeItem("ahok_admin");
  }
  window.dispatchEvent(new Event("ahok-admin-change"));
}

export function promptAdminPassword() {
  const pwd = window.prompt("Masukkan password admin:");
  if (pwd === ADMIN_PASSWORD) {
    setAdminMode(true);
    return true;
  }
  if (pwd !== null) {
    alert("Password salah.");
  }
  return false;
}

export function toggleAdminMode() {
  if (isAdminMode()) {
    if (window.confirm("Keluar dari Mode Admin?")) {
      setAdminMode(false);
    }
  } else {
    promptAdminPassword();
  }
}