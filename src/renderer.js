const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

const canvas = document.querySelector("canvas");
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);
