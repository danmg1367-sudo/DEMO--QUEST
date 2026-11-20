"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { getSessionUser } from "@/lib/auth";
import { addCaso, type Estudio } from "@/lib/casos";

const emptyEstudio = (): Estudio => ({
  id: crypto.randomUUID(),
  estudio: "",
  tipoEstudio: "",
  recipiente: "",
  sitioAnatomico: "",
  fechaMuestra: "",
  prioridad: "NORMAL",
});

export default function IngresoPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; nombre: string } | null>(null);

  // paciente
  const [tipoDoc, setTipoDoc] = useState("");
  const [numDoc, setNumDoc] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [genero, setGenero] = useState("");

  // servicio
  const [sede, setSede] = useState("");
  const [entidad, setEntidad] = useState("");
  const [unidadRef, setUnidadRef] = useState("");
  const [servicioSolicitante, setServicioSolicitante] = useState("");
  const [medicoSolicitante, setMedicoSolicitante] = useState("");
  const [folioManual, setFolioManual] = useState("");

  // estudios
  const [draft, setDraft] = useState<Estudio>(emptyEstudio());
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const edad = (() => {
    if (!fechaNac) return "Se calcula sola";
    const d = new Date(fechaNac);
    if (isNaN(d.getTime())) return "Se calcula sola";
    const hoy = new Date();
    let e = hoy.getFullYear() - d.getFullYear();
    const m = hoy.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < d.getDate())) e--;
    return `${e} años`;
  })();

  const agregarEstudio = () => {
    if (!draft.estudio || !draft.tipoEstudio || !draft.sitioAnatomico) {
      setMsg("Completa estudio, tipo y sitio anatómico");
      return;
    }
    setEstudios((prev) => [...prev, { ...draft, id: crypto.randomUUID() }]);
    setDraft(emptyEstudio());
    setMsg("");
  };

  const quitarEstudio = (id: string) => {
    setEstudios((prev) => prev.filter((e) => e.id !== id));
  };

  const guardar = (irSeguimiento: boolean) => {
    if (!user) return;
    if (!primerNombre || !primerApellido || !numDoc) {
      setMsg("Completa nombre, apellido y número de documento");
      return;
    }
    if (estudios.length === 0) {
      setMsg("Agrega al menos un estudio");
      return;
    }
    const folio =
      folioManual.trim() ||
      `IQ-${Date.now().toString().slice(-6)}`;

    const caso = {
      id: crypto.randomUUID(),
      folio,
      pathologoId: user.id,
      pathologoNombre: user.nombre,
      tipoDoc,
      numDoc,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      fechaNac,
      genero,
      sede,
      entidad,
      unidadRef,
      servicioSolicitante,
      medicoSolicitante,
      estudios,
      macro: "",
      micro: "",
      diagnostico: "",
      comentario: "",
      estado: "Pendiente de validación",
      createdAt: new Date().toISOString(),
    };
    addCaso(caso);
    localStorage.setItem("patologia_caso_activo", caso.id);
    setMsg("Caso guardado");
    if (irSeguimiento) router.push("/seguimiento");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white";
  const label = "text-xs text-slate-600 mb-1 block";
  const card = "bg-white rounded-xl border border-slate-200 p-5 shadow-sm";

  return (
    <div className="min-h-screen bg-slate-100">
      <AppNav />
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-slate-500">
        Inicio › Ingreso › <span className="text-blue-600">Ingresar petición</span>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-10 space-y-4">
        {msg && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 text-sm">
            {msg}
          </div>
        )}

        {/* DATOS DEL PACIENTE */}
        <section className={card}>
          <h2 className="font-bold text-slate-800 mb-4 tracking-wide">DATOS DEL PACIENTE</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className={label}>Tipo de documento *</label>
              <select className={input} value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>
                <option value="">Seleccione...</option>
                <option>CC</option>
                <option>CE</option>
                <option>TI</option>
                <option>Pasaporte</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className={label}>N. de Identificación *</label>
              <input className={input} placeholder="Ej. 7177202" value={numDoc} onChange={(e) => setNumDoc(e.target.value)} />
            </div>
            <div>
              <label className={label}>Primer nombre *</label>
              <input className={input} value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value)} />
            </div>
            <div>
              <label className={label}>Segundo nombre</label>
              <input className={input} value={segundoNombre} onChange={(e) => setSegundoNombre(e.target.value)} />
            </div>
            <div>
              <label className={label}>Primer apellido *</label>
              <input className={input} value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value)} />
            </div>
            <div>
              <label className={label}>Segundo apellido</label>
              <input className={input} value={segundoApellido} onChange={(e) => setSegundoApellido(e.target.value)} />
            </div>
            <div>
              <label className={label}>Fecha de nacimiento *</label>
              <input type="date" className={input} value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} />
            </div>
            <div>
              <label className={label}>Edad</label>
              <input className={input + " bg-slate-50"} value={edad} readOnly />
            </div>
            <div>
              <label className={label}>Género *</label>
              <select className={input} value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="">Seleccione...</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
        </section>

        {/* DATOS DEL SERVICIO */}
        <section className={card}>
          <h2 className="font-bold text-slate-800 mb-4 tracking-wide">DATOS DEL SERVICIO</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className={label}>Sede *</label>
              <select className={input} value={sede} onChange={(e) => setSede(e.target.value)}>
                <option value="">Seleccione...</option>
                <option>Sede Principal</option>
                <option>Sede Norte</option>
                <option>Sede Sur</option>
              </select>
            </div>
            <div>
              <label className={label}>Entidad *</label>
              <select className={input} value={entidad} onChange={(e) => setEntidad(e.target.value)}>
                <option value="">Seleccione...</option>
                <option>Hospital</option>
                <option>Clínica</option>
                <option>Externo</option>
              </select>
            </div>
            <div>
              <label className={label}>Unidad de referencia</label>
              <input className={input} placeholder="Ej. Hospital de Especial" value={unidadRef} onChange={(e) => setUnidadRef(e.target.value)} />
            </div>
            <div>
              <label className={label}>Servicio solicitante *</label>
              <select className={input} value={servicioSolicitante} onChange={(e) => setServicioSolicitante(e.target.value)}>
                <option value="">Seleccione...</option>
                <option>Cirugía</option>
                <option>Ginecología</option>
                <option>Oncología</option>
                <option>Dermatología</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className={label}>Médico solicitante *</label>
              <input className={input} placeholder="Nombre del médico" value={medicoSolicitante} onChange={(e) => setMedicoSolicitante(e.target.value)} />
            </div>
            <div>
              <label className={label}>Folio</label>
              <input className={input} placeholder="Auto si vacío" value={folioManual} onChange={(e) => setFolioManual(e.target.value)} />
            </div>
          </div>
        </section>

        {/* AGREGAR ESTUDIOS */}
        <section className={card}>
          <h2 className="font-bold text-slate-800 mb-4 tracking-wide">AGREGAR ESTUDIOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className={label}>Estudio *</label>
              <select
                className={input}
                value={draft.estudio}
                onChange={(e) => setDraft({ ...draft, estudio: e.target.value })}
              >
                <option value="">Seleccione...</option>
                <option>BIOPSIA MAMA</option>
                <option>BIOPSIA PIEL</option>
                <option>CITOLOGIA</option>
                <option>PIEZA QUIRURGICA</option>
                <option>OTRO</option>
              </select>
            </div>
            <div>
              <label className={label}>Tipo estudio *</label>
              <select
                className={input}
                value={draft.tipoEstudio}
                onChange={(e) => setDraft({ ...draft, tipoEstudio: e.target.value })}
              >
                <option value="">Seleccione...</option>
                <option>QUIRURGICO</option>
                <option>ENDOSCOPICO</option>
                <option>PUNCION</option>
                <option>CITOLOGIA</option>
              </select>
            </div>
            <div>
              <label className={label}>Recipiente / conservante *</label>
              <select
                className={input}
                value={draft.recipiente}
                onChange={(e) => setDraft({ ...draft, recipiente: e.target.value })}
              >
                <option value="">Seleccione...</option>
                <option>FORMOL</option>
                <option>SUERO</option>
                <option>FRESCO</option>
                <option>OTRO</option>
              </select>
            </div>
            <div>
              <label className={label}>Sitio anatómico *</label>
              <select
                className={input}
                value={draft.sitioAnatomico}
                onChange={(e) => setDraft({ ...draft, sitioAnatomico: e.target.value })}
              >
                <option value="">Seleccione...</option>
                <option>MAMA</option>
                <option>PIEL</option>
                <option>COLON</option>
                <option>UTEROS</option>
                <option>OTRO</option>
              </select>
            </div>
            <div>
              <label className={label}>Fecha T. muestra *</label>
              <input
                type="date"
                className={input}
                value={draft.fechaMuestra}
                onChange={(e) => setDraft({ ...draft, fechaMuestra: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Prioridad *</label>
              <select
                className={input}
                value={draft.prioridad}
                onChange={(e) => setDraft({ ...draft, prioridad: e.target.value })}
              >
                <option>NORMAL</option>
                <option>URGENTE</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={agregarEstudio}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            + Agregar estudio
          </button>
        </section>

        {/* ESTUDIOS AGREGADOS */}
        <section className={card}>
          <h2 className="font-bold text-slate-800 mb-3 tracking-wide">ESTUDIOS AGREGADOS</h2>
          {estudios.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-lg py-10 text-center text-slate-400 text-sm">
              Sin estudios agregados
            </div>
          ) : (
            <ul className="space-y-2">
              {estudios.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <span>
                    <strong>{e.estudio}</strong> · {e.tipoEstudio} · {e.sitioAnatomico} · {e.prioridad}
                  </span>
                  <button
                    type="button"
                    onClick={() => quitarEstudio(e.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => guardar(false)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => guardar(true)}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            Continuar al seguimiento →
          </button>
        </div>
      </main>
    </div>
  );
}
