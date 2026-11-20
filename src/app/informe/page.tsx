"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { getSessionUser } from "@/lib/auth";
import { getCasoById, nombreCompleto, type Caso } from "@/lib/casos";

export default function InformePage() {
  const router = useRouter();
  const [caso, setCaso] = useState<Caso | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUserName(u.nombre);
    const id = localStorage.getItem("patologia_caso_activo");
    if (!id) return;
    const c = getCasoById(id);
    if (c && c.pathologoId === u.id) setCaso(c);
  }, [router]);

  if (!caso) {
    return (
      <div className="min-h-screen bg-slate-100">
        <AppNav />
        <div className="max-w-3xl mx-auto p-8 text-center text-slate-500">
          No hay caso seleccionado. Ve a Seguimiento y abre un caso.
          <div className="mt-4">
            <button
              onClick={() => router.push("/seguimiento")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            >
              Ir a Seguimiento
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estudiosTxt =
    caso.estudios?.map((e) => e.estudio).filter(Boolean).join(", ") || "—";

  return (
    <div className="min-h-screen bg-slate-100">
      <AppNav />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white text-gray-900 shadow-lg rounded-lg overflow-hidden print:shadow-none">
          <div className="bg-blue-800 text-white px-8 py-5">
            <h1 className="text-xl font-bold">Informe de patología</h1>
            <p className="text-sm text-blue-100">DemoQuest · Laboratorio de anatomía patológica</p>
          </div>

          <div className="px-8 py-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Folio</p>
                <p className="font-semibold">{caso.folio}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Estado</p>
                <p className="font-semibold">{caso.estado}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Paciente</p>
                <p className="font-semibold">{nombreCompleto(caso)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Documento</p>
                <p className="font-semibold">
                  {caso.tipoDoc} {caso.numDoc}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500 text-xs">Estudio(s) solicitado(s)</p>
                <p className="font-semibold">{estudiosTxt}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Médico solicitante</p>
                <p className="font-semibold">{caso.medicoSolicitante || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Servicio</p>
                <p className="font-semibold">{caso.servicioSolicitante || "—"}</p>
              </div>
            </div>

            <div>
              <h2 className="text-blue-900 font-bold text-sm tracking-wide">
                1. DESCRIPCIÓN MACROSCÓPICA
              </h2>
              <div className="border-b-2 border-blue-800 mt-1 mb-3" />
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                {caso.macro?.trim()
                  ? caso.macro
                  : "Sin descripción macroscópica registrada."}
              </p>
            </div>

            <div>
              <h2 className="text-blue-900 font-bold text-sm tracking-wide">
                2. DESCRIPCIÓN MICROSCÓPICA
              </h2>
              <div className="border-b-2 border-blue-800 mt-1 mb-3" />
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                {caso.micro?.trim()
                  ? caso.micro
                  : "Sin descripción microscópica registrada."}
              </p>
            </div>

            <div>
              <h2 className="text-blue-900 font-bold text-sm tracking-wide">3. DIAGNÓSTICO</h2>
              <div className="border-b-2 border-blue-800 mt-1 mb-3" />
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                {caso.diagnostico?.trim()
                  ? caso.diagnostico
                  : caso.estado || "Pendiente de validación."}
              </p>
              {caso.comentario?.trim() ? (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Comentario:</strong> {caso.comentario}
                </p>
              ) : null}
            </div>

            <div className="pt-10 mt-6 border-t">
              <p className="text-xs text-gray-500 mb-8">Firma del médico patólogo</p>
              <div className="border-b border-gray-800 w-64 mb-2" />
              <p className="font-semibold text-sm">{caso.pathologoNombre || userName}</p>
              <p className="text-xs text-gray-500">Médico patólogo asignado</p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 flex flex-wrap gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
            >
              Imprimir
            </button>
            <button
              onClick={() => router.push("/informe/finalizado")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            >
              Finalizar caso
            </button>
            <button
              onClick={() => router.push("/seguimiento")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
