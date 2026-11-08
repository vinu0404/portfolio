"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { buildGraph } from "@/lib/graph";
import { addTick } from "@/lib/ticker";
import { scrollState } from "@/lib/scroll";

const CYAN = new THREE.Color("#0284c7");
const VIOLET = new THREE.Color("#7c3aed");
const IDLE = new THREE.Color("#8e99a8");
const EDGE_IDLE = new THREE.Color("#c3cbd5");
const PERIOD = 7; // seconds for one full topological pass

/** Wave front position in layers at time t. Nodes in layer <= front are "done". */
const front = (t: number, layers: number) => ((t % PERIOD) / PERIOD) * (layers + 2) - 0.5;

function Graph({ mobile }: { mobile: boolean }) {
  const g = useMemo(() => buildGraph(mobile ? 7 : 9, mobile ? 6 : 9), [mobile]);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  const edgeGeom = useMemo(() => {
    const pos = new Float32Array(g.edges.length * 6);
    g.edges.forEach((e, i) => {
      const a = g.nodes[e.from];
      const b = g.nodes[e.to];
      pos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.edges.length * 6), 3));
    return geom;
  }, [g]);

  useEffect(() => () => edgeGeom.dispose(), [edgeGeom]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const w = front(t, g.layers);
    const n = nodes.current!;
    const p = packets.current!;

    g.nodes.forEach((node, i) => {
      const since = w - node.layer; // > 0 once this node has run
      const lit = since > 0 ? Math.exp(-since * 0.9) : 0;
      const glow = since > 0 && since < 0.35 ? 1 : lit;
      col.copy(IDLE).lerp(node.layer % 3 === 2 ? VIOLET : CYAN, Math.min(1, glow * 1.2 + 0.08));
      col.multiplyScalar(1 + glow * 1.6); // >1 pushes past the bloom threshold
      n.setColorAt(i, col);
      tmp.position.set(node.x, node.y, node.z);
      tmp.scale.setScalar(0.11 + glow * 0.1);
      tmp.updateMatrix();
      n.setMatrixAt(i, tmp.matrix);
    });
    n.instanceMatrix.needsUpdate = true;
    if (n.instanceColor) n.instanceColor.needsUpdate = true;

    const colors = edgeGeom.getAttribute("color") as THREE.BufferAttribute;
    g.edges.forEach((e, i) => {
      const a = g.nodes[e.from];
      const b = g.nodes[e.to];
      const prog = (w - a.layer) / Math.max(1, b.layer - a.layer);
      const active = prog > 0 && prog < 1;
      const k = active ? 1 : prog >= 1 ? 0.5 * Math.exp(-(w - b.layer) * 0.5) : 0;
      col.copy(EDGE_IDLE).lerp(CYAN, k);
      colors.setXYZ(i * 2, col.r, col.g, col.b);
      colors.setXYZ(i * 2 + 1, col.r, col.g, col.b);
      // a packet rides each edge while its source has finished and its target hasn't
      tmp.position.set(a.x + (b.x - a.x) * prog, a.y + (b.y - a.y) * prog, a.z + (b.z - a.z) * prog);
      tmp.scale.setScalar(active ? 0.06 : 0);
      tmp.updateMatrix();
      p.setMatrixAt(i, tmp.matrix);
    });
    colors.needsUpdate = true;
    p.instanceMatrix.needsUpdate = true;

    group.current!.rotation.y = Math.sin(t * 0.07) * 0.12;
    group.current!.rotation.x = Math.cos(t * 0.05) * 0.05;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={nodes} args={[undefined, undefined, g.nodes.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={packets} args={[undefined, undefined, g.edges.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={new THREE.Color(0.02, 1.4, 2.4)} toneMapped={false} />
      </instancedMesh>
      <lineSegments ref={lines} geometry={edgeGeom} frustumCulled={false}>
        <lineBasicMaterial vertexColors toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/** Camera: scroll flies forward through the layers, pointer adds parallax. */
function Rig({ reduced }: { reduced: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    const hero = Math.min(1, scrollState.y / (scrollState.viewport || 1));
    const targetZ = 7 - hero * 14;
    const k = reduced ? 1 : 0.08;
    camera.position.x += (pointer.current.x * 1.6 - camera.position.x) * k;
    camera.position.y += (-pointer.current.y * 1.0 - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.lookAt(0, 0, camera.position.z - 10);
  });
  return null;
}

/** Steps this canvas from the shared ticker, only while it is on screen. */
function Driver({ visible, reduced }: { visible: React.RefObject<boolean>; reduced: boolean }) {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (reduced) {
      // one still frame mid-pass, so the graph is visibly lit
      const id = requestAnimationFrame(() => advance(PERIOD * 0.45));
      return () => cancelAnimationFrame(id);
    }
    return addTick((time) => {
      if (visible.current) advance(time / 1000);
    });
  }, [advance, reduced, visible]);
  return null;
}

export default function HeroScene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop="never"
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, 7], fov: 55, near: 0.1, far: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        resize={{ scroll: false }}
        aria-hidden="true"
      >
        <color attach="background" args={["#f4f5f7"]} />
        <fog attach="fog" args={["#f4f5f7", 6, 26]} />
        <Graph mobile={mobile} />
        <Rig reduced={reduced} />
        <Driver visible={visible} reduced={reduced} />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={mobile ? 0.5 : 0.7} radius={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
