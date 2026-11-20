"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSessionUser, logoutUser } from "@/lib/auth";
import { useEffect, useState } from "react";

const links = [
  { href: "/ingreso", label: "Ingreso" },
  { href: "/seguimiento", label: "Seguimiento" },
  { href: "/informe", label: "Informe" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const salir = () => {
    logoutUser();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/seguimiento" className="flex items-center gap-2 font-bold text-slate-800">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">P</span>
            Patologia
          </Link>
          <nav className="hidden sm:flex items-center gap-1 ml-2">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition " +
                    (active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-slate-400">Patólogo a cargo</p>
            <p className="text-sm text-slate-800 font-medium">{user.nombre}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
            👤
          </div>
          <button
            onClick={salir}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      {/* mobile nav */}
      <div className="sm:hidden border-t border-slate-100 px-4 py-2 flex gap-2 overflow-x-auto">
        {links.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap " +
                (active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")
              }
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
