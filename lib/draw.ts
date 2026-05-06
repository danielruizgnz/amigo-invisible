/**
 * Algoritmo de sorteo Secret Santa con restricciones de exclusión.
 * Usa backtracking para garantizar una asignación válida.
 */
export function sortearAmigoInvisible(
  participantes: string[],
  exclusiones: Array<{ de: string; a: string }>
): Map<string, string> | null {
  if (participantes.length < 2) return null;

  const shuffled = [...participantes].sort(() => Math.random() - 0.5);
  const resultado = new Map<string, string>();
  const excluidos = new Set(exclusiones.map((e) => `${e.de}:${e.a}`));

  function puedeAsignar(dador: string, receptor: string): boolean {
    if (dador === receptor) return false;
    if (excluidos.has(`${dador}:${receptor}`)) return false;
    return true;
  }

  function backtrack(givers: string[], restantes: string[]): boolean {
    if (givers.length === 0) return true;

    const dador = givers[0];
    const candidatos = restantes
      .filter((r) => puedeAsignar(dador, r))
      .sort(() => Math.random() - 0.5);

    for (const receptor of candidatos) {
      resultado.set(dador, receptor);
      const nuevosRestantes = restantes.filter((r) => r !== receptor);
      if (backtrack(givers.slice(1), nuevosRestantes)) return true;
      resultado.delete(dador);
    }

    return false;
  }

  const exito = backtrack(shuffled, [...participantes]);
  return exito ? resultado : null;
}
