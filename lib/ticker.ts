"use client";
// The one requestAnimationFrame loop. Lenis, Anime.js and the hero canvas all step from here.
import { engine } from "animejs";

type Tick = (time: number, delta: number) => void;

const subs = new Set<Tick>();
let raf = 0;
let last = 0;

function loop(time: number) {
  raf = requestAnimationFrame(loop);
  const delta = last ? time - last : 16.7;
  last = time;
  subs.forEach((fn) => fn(time, delta));
}

let started = false;
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  engine.useDefaultMainLoop = false;
  subs.add(() => engine.update());
  raf = requestAnimationFrame(loop);
}

export function addTick(fn: Tick) {
  start();
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Call once on the client so Anime.js has a loop even before anything else subscribes. */
export function ensureTicker() {
  start();
  return raf;
}
