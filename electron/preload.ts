import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('app:select-folder'),
  saveConfig: (config: object) => ipcRenderer.invoke('app:save-config', config),
  uploadFile: (filePath: string, destName: string) => ipcRenderer.invoke('files:upload', filePath, destName),
  parseAllFiles: () => ipcRenderer.invoke('files:parse-all'),
  startGeneration: () => ipcRenderer.invoke('generate:start'),
  onGenerationProgress: (cb: (data: object) => void) => ipcRenderer.on('generate:progress', (_e, d) => cb(d)),
  onGenerationComplete: (cb: (data: object) => void) => ipcRenderer.on('generate:complete', (_e, d) => cb(d)),
  downloadZip: () => ipcRenderer.invoke('output:download-zip'),
  pushToGitHub: (config: object) => ipcRenderer.invoke('output:push-github', config),
  getFileContent: (filePath: string) => ipcRenderer.invoke('output:get-file-content', filePath),
});