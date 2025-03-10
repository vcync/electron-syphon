const spout =
  process.platform === "win32" ? require("../build/Release/spout.node") : null;
const syphon =
  process.platform === "darwin"
    ? require("../build/Release/syphon.node")
    : null;

let gl;

let canvas2D;
let context2D;

const text = "Hello, Syphon!";

const niceColors = [
  [
    "color(display-p3 0.25 0.08 0.28)",
    "color(display-p3 0.52 0.05 0.44)",
    "color(display-p3 0.78 0 0.48)",
    "color(display-p3 0.9 0.22 0.46)",
    "color(display-p3 1 0.38 0.28)",
  ],
  [
    "color(display-p3 0.05 0.8 0.9)",
    "color(display-p3 0.02 0.55 0.74)",
    "color(display-p3 0.9 0.82 0.48)",
    "color(display-p3 0.96 0.48 0.1)",
    "color(display-p3 0.4 0.1 0)",
  ],
  [
    "color(display-p3 1 0.78 0.7)",
    "color(display-p3 1 0.64 0.55)",
    "color(display-p3 0.92 0.24 0.53)",
    "color(display-p3 0.5 0.05 0.3)",
    "color(display-p3 0.62 0.18 0.5)",
  ],
  [
    "color(display-p3 0.16 0.1 0.11)",
    "color(display-p3 0.18 0.22 0.22)",
    "color(display-p3 0.08 0.3 0.3)",
    "color(display-p3 0.45 0.65 0.54)",
    "color(display-p3 0.88 0.89 0.78)",
  ],
  [
    "color(display-p3 0.1 0.5 0.52)",
    "color(display-p3 0.32 0.66 0.28)",
    "color(display-p3 0.55 0.85 0.12)",
    "color(display-p3 0.74 1 0)",
    "color(display-p3 0.94 1 0.92)",
  ],
  [
    "color(display-p3 0.98 0.95 0.7)",
    "color(display-p3 0.83 0.9 0.6)",
    "color(display-p3 0.6 0.78 0.6)",
    "color(display-p3 0.4 0.6 0.6)",
    "color(display-p3 0.3 0.44 0.6)",
  ],
  [
    "color(display-p3 0.28 1 0.85)",
    "color(display-p3 0.45 0.38 0.3)",
    "color(display-p3 1 0.45 0.3)",
    "color(display-p3 1 0.8 0.4)",
    "color(display-p3 0.25 0.9 0.5)",
  ],
  [
    "color(display-p3 0.68 0.63 0.46)",
    "color(display-p3 0.78 0.74 0)",
    "color(display-p3 1 0.08 0.4)",
    "color(display-p3 0.82 0.12 0.5)",
    "color(display-p3 0.24 0.18 0.4)",
  ],
  [
    "color(display-p3 0.05 0.75 0.8)",
    "color(display-p3 0.16 0.05 0.4)",
    "color(display-p3 1 0.03 0.5)",
    "color(display-p3 1 0.72 0.32)",
    "color(display-p3 0.88 0.85 0.6)",
  ],
  [
    "color(display-p3 1 0.45 0.2)",
    "color(display-p3 0.65 0.7 0.1)",
    "color(display-p3 0.4 0.65 0.85)",
    "color(display-p3 0.16 0.45 0.7)",
    "color(display-p3 0.05 0.3 0.55)",
  ],
  [
    "color(display-p3 0.24 0 0.28)",
    "color(display-p3 0.26 0.15 0.3)",
    "color(display-p3 0.26 0.28 0.4)",
    "color(display-p3 0.46 0.58 0.58)",
    "color(display-p3 0.94 0.86 0.72)",
  ],
  [
    "color(display-p3 0.78 0.4 0.72)",
    "color(display-p3 0.82 0 0.6)",
    "color(display-p3 1 0.2 0.4)",
    "color(display-p3 1 0.8 0.2)",
    "color(display-p3 0.8 1 0.2)",
  ],
  [
    "color(display-p3 0.7 1 0.95)",
    "color(display-p3 0.6 0.8 0.85)",
    "color(display-p3 0.56 0.54 0.72)",
    "color(display-p3 0.45 0.35 0.6)",
    "color(display-p3 0.35 0.15 0.4)",
  ],
];

let colors = niceColors[Math.floor(Math.random() * niceColors.length)];

let gradients = [];
let gradientSize = 1;
let seed = Math.random() * 100000;
let width = 1920;
let height = 1080;

gradients = [];
gradientSize = width / 1.2;

const copyCanvas = new OffscreenCanvas(1920, 1080);
const copyContext = copyCanvas.getContext("2d", {
  willReadFrequently: true,
  colorSpace: "display-p3",
});

self.onmessage = (event) => {
  if (event.data.canvas) {
    const canvas = event.data.canvas;

    context2D = canvas.getContext("2d", { colorSpace: "display-p3" });
    canvas2D = canvas;

    context2D.font = "normal 72px system-ui";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";

    context2D.fillStyle = "rgb(0, 0, 0)";
    context2D.fillRect(0, 0, width, height);

    let rotation = seed;
    const stretchX = 5;
    const stretchX2 = stretchX * 2;
    const stretchY = 5;
    const stretchY2 = stretchY * 2;

    const radius = 0.4;

    for (let i = 0; i < colors.length * 5; i += 1) {
      const gradient = context2D.createRadialGradient(
        gradientSize / 2,
        gradientSize / 2,
        0,
        gradientSize / 2,
        gradientSize / 2,
        gradientSize / 2
      );

      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      gradients.push(gradient);
    }

    function sendFrame(timestamp) {
      const width = canvas2D.width;
      const height = canvas2D.height;

      const spacing = 360 / gradients.length;
      const localT = timestamp + seed;

      context2D.fillStyle = "rgba(0,0,0,1)";
      context2D.fillRect(0, 0, width, height);

      context2D.drawImage(
        context2D.canvas,
        0 - stretchX,
        0 - stretchY,
        width + stretchX2,
        height + stretchY2
      );

      for (let i = 0; i < gradients.length; i += 1) {
        const x = Math.cos((rotation * Math.PI) / 180) * gradientSize;
        const y = Math.sin((rotation * Math.PI) / 180) * gradientSize;
        rotation += spacing + 0.01;

        context2D.save();
        context2D.globalCompositeOperation = "lighter";
        context2D.globalAlpha = gradients.length / 50;
        context2D.fillStyle = gradients[i];
        context2D.translate(
          0 +
            width / 2 -
            gradientSize / 2 +
            x * radius * Math.sin((localT + i * 1000 + 1) / 1000),
          0 +
            height / 2 -
            gradientSize / 2 +
            y * radius * Math.cos((localT + i + 1) / 2000)
        );
        context2D.fillRect(0, 0, gradientSize, gradientSize);
        context2D.restore();
      }

      context2D.fillStyle = "color(display-p3 0.0 0.0 0.0 / 2%)";

      context2D.fillRect(0, 0, canvas2D.width, canvas2D.height);

      context2D.fillStyle = "color(display-p3 1.0 1.0 1.0)";

      context2D.fillText(text, canvas2D.width / 2, canvas2D.height / 2);

      copyContext.drawImage(canvas2D, 0, 0);

      const pixels = copyContext.getImageData(
        0,
        0,
        canvas2D.width,
        canvas2D.height
      );

      if (spout) {
        console.warn("Spout not implemented yet.");
        // spout.publishSyphonFrame(pixels.data, width, height);
      } else {
        syphon.publishSyphonFrame(pixels.data, width, height);
      }

      requestAnimationFrame(sendFrame);
    }

    requestAnimationFrame(sendFrame);
  }
};
