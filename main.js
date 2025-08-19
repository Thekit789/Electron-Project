const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  // สร้างหน้าต่างเบราว์เซอร์ใหม่
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // โหลดไฟล์ index.html
  win.loadFile("index.html");

  // เปิด DevTools (ใช้สำหรับดีบั๊ก)
  // win.webContents.openDevTools();
}

// เมื่อ Electron พร้อมทำงาน ให้สร้างหน้าต่างขึ้นมา
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // สำหรับ macOS, ให้สร้างหน้าต่างใหม่หากไม่มี
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// ปิดแอปพลิเคชันเมื่อหน้าต่างทั้งหมดถูกปิด (ยกเว้น macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
