"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";

export default function Finalizado() {
  const router = useRouter();

  useEffect(() => {
    if (!getSessionUser()) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Caso finalizado</h1>
        <p className="text-slate-500 mb-8">El informe ha sido cerrado correctamente.</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/informe"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
          >
            Ver informe
          </Link>
          <Link
            href="/seguimiento"
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg"
          >
            Volver a seguimiento
          </Link>
          <Link
            href="/ingreso"
            className="text-blue-600 text-sm hover:underline"
          >
            Nuevo ingreso
          </Link>
        </div>
      </div>
    </div>
  );
}
