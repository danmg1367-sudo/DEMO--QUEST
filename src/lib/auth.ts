export type User = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: "patologo";
  createdAt: string;
};

const USERS_KEY = "patologia_users";
const SESSION_KEY = "patologia_session";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(data: {
  nombre: string;
  email: string;
  password: string;
}): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: "Ese correo ya está registrado" };
  }
  const user: User = {
    id: crypto.randomUUID(),
    nombre: data.nombre.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    rol: "patologo",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return { ok: true, user };
}

export function loginUser(
  email: string,
  password: string
): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: "Correo o contraseña incorrectos" };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return { ok: true, user };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    return getUsers().find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
}
