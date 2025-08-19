const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200, // เพิ่มความกว้างเพื่อให้พอดีกับฟอร์ม
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // ปิดไว้ก่อนถ้ายังไม่ได้ใช้
      nodeIntegration: true, // อาจจำเป็นสำหรับการทำงานบางอย่างในอนาคต
      contextIsolation: false,
    },
  });

  // โหลดไฟล์ index.html ของเรา (หน้าฟอร์ม)
  win.loadFile("index.html");

  // เปิด DevTools สำหรับดีบั๊ก
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
