const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

function createWindow() {
	const win = new BrowserWindow({
		width: 700,
		height: 530,
		darkTheme: true,
		resizable: false,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	})
	win.setMenu(null)
	win.loadURL(`file://${__dirname}/assets/index.html`)
	ipcMain.on("minimize-app", (evt, arg) => {
		win.minimize()
	})
}
ipcMain.on("close-app", (evt, arg) => {
	app.quit()
})
app.whenReady().then(createWindow)
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
