"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res =
      mode === "login"
        ? loginUser(email, password)
        : registerUser({ nombre, email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Error");
      return;
    }
    router.push("/ingreso");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,106,0,0.25)] border border-orange-500/30">
        <div className="bg-[#121a2b] p-8 md:p-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Login" : "Registro"}
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Acceso para patólogos · DemoQuest
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="text-xs text-slate-400">Nombre completo</label>
                <input
                  className="w-full mt-1 bg-transparent border-b border-slate-600 text-white py-2 outline-none focus:border-orange-500"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Dr. / Dra."
                />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-400">Correo</label>
              <input
                type="email"
                className="w-full mt-1 bg-transparent border-b border-slate-600 text-white py-2 outline-none focus:border-orange-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Contraseña</label>
              <input
                type="password"
                className="w-full mt-1 bg-transparent border-b border-slate-600 text-white py-2 outline-none focus:border-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400 text-center">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-orange-400 font-medium"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-orange-400 font-medium"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>

        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-orange-700 via-orange-600 to-amber-700 text-white">
          <h2 className="text-3xl font-bold mb-3">
            {mode === "login" ? "¡Bienvenido de nuevo!" : "Crea tu acceso"}
          </h2>
          <p className="text-orange-50/90 text-sm leading-relaxed">
            Cada patólogo tiene su propia cuenta. Solo verás los casos que tú
            registres. Prototipo DemoQuest · Laboratorio de anatomía patológica.
          </p>
        </div>
      </div>
    </div>
  );
}
