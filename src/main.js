const { app, BrowserWindow } = require("electron");

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false, // Renderer should not use Node
      contextIsolation: true,
      sandbox: false,
      nodeIntegrationInWorker: true, // Enable Node in Workers
    },
  });

  win.loadFile("./index.html");
});
