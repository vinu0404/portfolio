// Deterministic layered DAG for the hero. Layer index = topological order.

export type GraphNode = { x: number; y: number; z: number; layer: number };
export type GraphEdge = { from: number; to: number };

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function buildGraph(layers: number, perLayer: number, seed = 7) {
  const rand = rng(seed);
  const nodes: GraphNode[] = [];
  const byLayer: number[][] = [];
  const depth = 3.2; // distance between layers along -z

  for (let l = 0; l < layers; l++) {
    const count = Math.max(2, Math.round(perLayer * (0.6 + rand() * 0.8)));
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.8;
      const radius = 1.4 + rand() * 3.4;
      nodes.push({
        x: Math.cos(angle) * radius * 1.5,
        y: Math.sin(angle) * radius * 0.75,
        z: -l * depth + (rand() - 0.5) * 1.2,
        layer: l,
      });
      ids.push(nodes.length - 1);
    }
    byLayer.push(ids);
  }

  const edges: GraphEdge[] = [];
  for (let l = 1; l < layers; l++) {
    for (const to of byLayer[l]) {
      // every node depends on 1 to 2 nodes from earlier layers, which keeps the graph acyclic
      const deps = 1 + (rand() > 0.55 ? 1 : 0);
      for (let d = 0; d < deps; d++) {
        const back = l - 1 - (rand() > 0.8 && l > 1 ? 1 : 0);
        const pool = byLayer[back];
        const from = pool[Math.floor(rand() * pool.length)];
        if (!edges.some((e) => e.from === from && e.to === to)) edges.push({ from, to });
      }
    }
  }
  return { nodes, edges, layers, depth };
}
