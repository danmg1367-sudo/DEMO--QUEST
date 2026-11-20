"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { getSessionUser } from "@/lib/auth";
import {
  calcEdad,
  deleteCaso,
  getCasosByPathologo,
  nombreCompleto,
  updateCaso,
  type Caso,
} from "@/lib/casos";

const tabs = [
  "Histórico",
  "Datos clínicos",
  "QUIRURGICO",
  "Vista previa",
  "Adjuntos",
  "Notas",
  "Informe adicional",
] as const;

export default function SeguimientoPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; nombre: string } | null>(null);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [activo, setActivo] = useState<Caso | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("QUIRURGICO");
  const [macro, setMacro] = useState("");
  const [micro, setMicro] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [comentario, setComentario] = useState("");
  const [msg, setMsg] = useState("");

  const reload = (uid: string) => {
    const list = getCasosByPathologo(uid);
    setCasos(list);
    return list;
  };

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    const list = reload(u.id);
    const id = localStorage.getItem("patologia_caso_activo");
    if (id) {
      const c = list.find((x) => x.id === id);
      if (c) abrir(c);
    }
  }, [router]);

  const abrir = (c: Caso) => {
    setActivo(c);
    setMacro(c.macro || "");
    setMicro(c.micro || "");
    setDiagnostico(c.diagnostico || "");
    setComentario(c.comentario || "");
    localStorage.setItem("patologia_caso_activo", c.id);
    setMsg("");
  };

  const eliminar = (id: string) => {
    if (!user) return;
    if (!confirm("¿Eliminar este caso?")) return;
    deleteCaso(id);
    if (activo?.id === id) setActivo(null);
    reload(user.id);
  };

  const guardarExpediente = () => {
    if (!activo || !user) return;
    updateCaso(activo.id, { macro, micro, diagnostico, comentario });
    const list = reload(user.id);
    const c = list.find((x) => x.id === activo.id);
    if (c) setActivo(c);
    setMsg("Expediente guardado");
  };

  const validar = () => {
    if (!activo || !user) return;
    updateCaso(activo.id, {
      macro,
      micro,
      diagnostico,
      comentario,
      estado: "Validado",
    });
    const list = reload(user.id);
    const c = list.find((x) => x.id === activo.id);
    if (c) setActivo(c);
    setMsg("Caso validado");
  };

  const generarResultado = () => {
    if (!activo) return;
    updateCaso(activo.id, { macro, micro, diagnostico, comentario });
    localStorage.setItem("patologia_caso_activo", activo.id);
    router.push("/informe");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  const card = "bg-white rounded-xl border border-slate-200 p-5 shadow-sm";

  return (
    <div className="min-h-screen bg-slate-100">
      <AppNav />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>
          Inicio › Seguimiento › Lista de trabajo
          {activo ? (
            <>
              {" › "}
              <span className="text-blue-600">{activo.folio}</span>
            </>
          ) : null}
        </span>
        <button
          type="button"
          onClick={() => router.push("/ingreso")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Nuevo ingreso
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-12 space-y-4">
        {msg && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">
            {msg}
          </div>
        )}

        {/* Lista de casos */}
        <section className={card}>
          <h2 className="font-semibold text-slate-800 mb-3">Casos registrados</h2>
          {casos.length === 0 ? (
            <p className="text-sm text-slate-400">
              No hay casos.{" "}
              <button className="text-blue-600 underline" onClick={() => router.push("/ingreso")}>
                Crear ingreso
              </button>
            </p>
          ) : (
            <ul className="space-y-2">
              {casos.map((c) => (
                <li
                  key={c.id}
                  className={
                    "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm " +
                    (activo?.id === c.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 bg-white")
                  }
                >
                  <button type="button" className="text-left flex-1" onClick={() => abrir(c)}>
                    <span className="font-medium text-slate-800">{c.folio}</span>
                    {" – "}
                    <span>{nombreCompleto(c)}</span>{" "}
                    <span className="text-slate-500">({c.estado})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(c.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {activo && (
          <>
            {/* Cabecera paciente */}
            <section className={card + " flex flex-wrap items-start justify-between gap-3"}>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{nombreCompleto(activo)}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {activo.tipoDoc || "—"} {activo.numDoc} · {calcEdad(activo.fechaNac)} ·{" "}
                  {activo.genero || "No especificado"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Servicio: {activo.servicioSolicitante || "—"} · Médico sol.:{" "}
                  {activo.medicoSolicitante || "—"}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                {activo.estado}
              </span>
            </section>

            {/* Tabs */}
            <section className={card + " !p-0 overflow-hidden"}>
              <div className="flex flex-wrap gap-1 border-b border-slate-200 px-3 pt-3">
                {tabs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={
                      "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition " +
                      (tab === t
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-800")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {tab === "Histórico" && (
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>
                      <strong>Creado:</strong>{" "}
                      {new Date(activo.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Patólogo a cargo:</strong> {activo.pathologoNombre}
                    </p>
                    <p>
                      <strong>Estado actual:</strong> {activo.estado}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Registro de acciones del caso (prototipo).
                    </p>
                  </div>
                )}

                {tab === "Datos clínicos" && (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Sede</p>
                      <p className="font-medium">{activo.sede || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Entidad</p>
                      <p className="font-medium">{activo.entidad || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Unidad de referencia</p>
                      <p className="font-medium">{activo.unidadRef || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Folio</p>
                      <p className="font-medium">{activo.folio}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-slate-500 text-xs mb-2">Estudios</p>
                      <ul className="space-y-1">
                        {activo.estudios?.map((e) => (
                          <li key={e.id} className="rounded border border-slate-200 px-3 py-2">
                            {e.estudio} · {e.tipoEstudio} · {e.sitioAnatomico} · {e.prioridad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {(tab === "QUIRURGICO" || tab === "Vista previa") && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Descripción Macroscópica
                        </label>
                        <textarea
                          className="mt-1 w-full min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Escribir descripción macroscópica..."
                          value={macro}
                          onChange={(e) => setMacro(e.target.value)}
                          readOnly={tab === "Vista previa"}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Descripción Microscópica
                        </label>
                        <textarea
                          className="mt-1 w-full min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Escribir descripción microscópica..."
                          value={micro}
                          onChange={(e) => setMicro(e.target.value)}
                          readOnly={tab === "Vista previa"}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Descripción del Diagnóstico
                        </label>
                        <textarea
                          className="mt-1 w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Escribir diagnóstico..."
                          value={diagnostico}
                          onChange={(e) => setDiagnostico(e.target.value)}
                          readOnly={tab === "Vista previa"}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Comentario</label>
                        <textarea
                          className="mt-1 w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Comentarios adicionales..."
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          readOnly={tab === "Vista previa"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {tab === "Adjuntos" && (
                  <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg p-8 text-center">
                    Módulo de adjuntos (prototipo). Aquí se cargarían documentos o imágenes.
                    <div className="mt-3">
                      <input type="file" className="text-xs" />
                    </div>
                  </div>
                )}

                {tab === "Notas" && (
                  <textarea
                    className="w-full min-h-[140px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Notas internas del caso..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  />
                )}

                {tab === "Informe adicional" && (
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>Resumen para informe:</p>
                    <p>
                      <strong>Macro:</strong> {macro || "—"}
                    </p>
                    <p>
                      <strong>Micro:</strong> {micro || "—"}
                    </p>
                    <p>
                      <strong>Diagnóstico:</strong> {diagnostico || "—"}
                    </p>
                    <button
                      type="button"
                      onClick={generarResultado}
                      className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      Ir a generar resultado →
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Botones inferiores */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">Código: {activo.folio}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={guardarExpediente}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm"
                >
                  Guardar expediente
                </button>
                <button
                  type="button"
                  onClick={validar}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  Validar
                </button>
                <button
                  type="button"
                  onClick={generarResultado}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Generar resultado →
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
