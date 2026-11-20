export type Estudio = {
  id: string;
  estudio: string;
  tipoEstudio: string;
  recipiente: string;
  sitioAnatomico: string;
  fechaMuestra: string;
  prioridad: string;
};

export type Caso = {
  id: string;
  folio: string;
  pathologoId: string;
  pathologoNombre: string;
  // paciente
  tipoDoc: string;
  numDoc: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNac: string;
  genero: string;
  // servicio
  sede: string;
  entidad: string;
  unidadRef: string;
  servicioSolicitante: string;
  medicoSolicitante: string;
  // estudios
  estudios: Estudio[];
  // clinica
  macro: string;
  micro: string;
  diagnostico: string;
  comentario: string;
  estado: string;
  createdAt: string;
};

const CASOS_KEY = "patologia_casos_v3";

export function getAllCasos(): Caso[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CASOS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getCasosByPathologo(pathologoId: string): Caso[] {
  return getAllCasos().filter((c) => c.pathologoId === pathologoId);
}

export function saveCasos(casos: Caso[]) {
  localStorage.setItem(CASOS_KEY, JSON.stringify(casos));
}

export function addCaso(caso: Caso) {
  const all = getAllCasos();
  all.unshift(caso);
  saveCasos(all);
}

export function updateCaso(id: string, patch: Partial<Caso>) {
  const all = getAllCasos().map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveCasos(all);
}

export function deleteCaso(id: string) {
  saveCasos(getAllCasos().filter((c) => c.id !== id));
}

export function getCasoById(id: string): Caso | undefined {
  return getAllCasos().find((c) => c.id === id);
}

export function nombreCompleto(c: Caso) {
  return [c.primerNombre, c.segundoNombre, c.primerApellido, c.segundoApellido]
    .filter(Boolean)
    .join(" ")
    .trim() || "Paciente sin nombre";
}

export function calcEdad(fechaNac: string): string {
  if (!fechaNac) return "No calculada";
  const d = new Date(fechaNac);
  if (isNaN(d.getTime())) return "No calculada";
  const hoy = new Date();
  let edad = hoy.getFullYear() - d.getFullYear();
  const m = hoy.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < d.getDate())) edad--;
  return `${edad} años`;
}
