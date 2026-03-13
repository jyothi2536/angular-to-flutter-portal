import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
const isDev = process.env['NODE_ENV'] === 'development' || !app.isPackaged;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, minWidth: 1280, minHeight: 720,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
    backgroundColor: '#0F0F1A', show: false, title: '🎭 Flutter Migration Portal — Milan Approved™',
  });
  if (isDev) { mainWindow.loadURL('http://localhost:4200'); mainWindow.webContents.openDevTools(); }
  else { mainWindow.loadFile(path.join(__dirname, '../dist/angular-to-flutter-portal/browser/index.html')); }
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('app:select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, { properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});
ipcMain.handle('app:save-config', async (_event, config) => { console.log('Config saved:', config); return { success: true }; });
ipcMain.handle('files:upload', async (_event, filePath, destName) => {
  const tmpDir = path.join(app.getPath('temp'), 'flutter-portal');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const dest = path.join(tmpDir, destName);
  fs.copyFileSync(filePath, dest);
  return { success: true, path: dest };
});
ipcMain.handle('files:parse-all', async () => {
  await new Promise(r => setTimeout(r, 2000));
  return { routes: 47, apis: 203, models: 38, components: 127, testCases: 847, warnings: ['Auth flow unclear', '3 duplicate API endpoints'], errors: [] };
});
ipcMain.handle('generate:start', async (event) => {
  const steps = ['Parsing documents...','Generating Dart Models...','Generating API Services...','Generating Routing...','Generating UI Widgets...','Generating State Management...','Generating Tests...','Packaging ZIP...'];
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, 2500));
    event.sender.send('generate:progress', { step: i, message: steps[i], percent: Math.round(((i + 1) / steps.length) * 100) });
  }
  event.sender.send('generate:complete', { filesGenerated: 156, linesOfCode: 12400, timeTaken: 28, testFiles: 47, apisIntegrated: 203, widgetsCreated: 127 });
  return { success: true };
});
ipcMain.handle('output:download-zip', async () => {
  const result = await dialog.showSaveDialog(mainWindow!, { defaultPath: 'flutter-project.zip', filters: [{ name: 'ZIP', extensions: ['zip'] }] });
  if (!result.canceled && result.filePath) { fs.writeFileSync(result.filePath, Buffer.from('mock zip')); shell.showItemInFolder(result.filePath); return { success: true }; }
  return { success: false };
});
ipcMain.handle('output:push-github', async (_e, config) => { await new Promise(r => setTimeout(r, 2000)); return { success: true, url: 'https://github.com/example/flutter-project' }; });
ipcMain.handle('output:get-file-content', async (_e, filePath) => { return "// Generated: " + filePath + "\nimport 'package:flutter/material.dart';\n\nclass ExampleWidget extends StatelessWidget {\n  const ExampleWidget({super.key});\n  @override\n  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Hello Flutter! 🎉')));\n}\n"; });