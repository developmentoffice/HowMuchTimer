const path = require('path')
const { app, BrowserWindow, Tray, screen, ipcMain, Menu } = require('electron')
const Model = require('./db/model.js')

class App
{
    constructor()
    {
        this.debug = false
        this.winWidth = 800
        this.winHeight = 400
        this.win = null
        this.tray = null
        this.model = new Model()
        this.dict = {}
        this.isTaskRunning = false

        app.whenReady()
            .then(async () => {
                this.createWindow()
                this.initEvents()
                this.initDBEvents()
                this.initTray()
                await this.getDict()
        })
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit()
        })
    }
    initTray()
    {
        this.tray = new Tray(path.join(__dirname, 'images/icons/16x16.png'))
    }
    createWindow()
    {
        const screenSize = screen.getPrimaryDisplay().size
        this.win = new BrowserWindow({
            width: this.winWidth,
            height: this.winHeight,
            x: screenSize.width - this.winWidth,
            y: 0,
            icon: path.join(__dirname, 'images/icons/512x512.png'),
            resizable: false,
            minimizable: false,
            maximizable: false,
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(__dirname, 'scripts/preload.js'),
                contextIsolation: false
            }
        })
        this.win.removeMenu()
        this.win.loadFile('index.html')
        this.win.on('close', event => {
            event.preventDefault()
            this.onCloseApp()
        })
        if (this.debug === false) {
            process.on('SIGINT', this.onCloseApp)
            process.on('SIGTERM', this.onCloseApp)
        }
        this.win.on('minimize', event => {
            event.preventDefault()
            this.win.hide()
        })

        if (this.debug) this.win.webContents.openDevTools()
    }
    onCloseApp()
    {
        this.win.webContents.send('close')
    }
    initEvents()
    {
        ipcMain.on('close-window', (event, arg) => {
            app.exit()
        })
    }
    getDict()
    {
        return new Promise((resolve, reject) => {
            ipcMain.on('dict', (event, dict) => {
                this.dict = dict
                if (this.isTaskRunning === false) this.tray.setToolTip(this.dict.no_running_tasks)
                resolve()
            })
        })
    }
    initDBEvents()
    {
        ipcMain.on('request-settings', async (event) => {
            const settings = await this.model.getSettings()
            this.win.webContents.send('get-settings', settings)
        })
        ipcMain.on('save-setting', async (event, args) => {
            await this.model.setSettings(args)
            this.win.webContents.send('success-setting')
        })
        ipcMain.on('request-tasks', async (event) => {
            const tasks = await this.model.getTasks()
            this.win.webContents.send('get-tasks', tasks)
        })
        ipcMain.on('request-statistic', async (event) => {
            const statistic = await this.model.getStatistic()
            this.win.webContents.send('get-statistic', statistic)
        })
        ipcMain.on('add-task', async (event, task) => {
            const taskId = await this.model.addTask(task)
            this.win.webContents.send('success-task', taskId)
        })
        ipcMain.on('del-task', async (event, id) => {
            await this.model.delTask(id)
            this.win.webContents.send('success-task')
        })
        ipcMain.on('request-start', async (event, args) => {
            const timerId = await this.model.timerStart(args)
            this.isTaskRunning = true
            this.win.webContents.send('get-start', timerId)
        })
        ipcMain.on('request-stop', async (event, args) => {
            await this.model.timerStop(args)
            this.win.webContents.send('success-stop')
            this.isTaskRunning = false
            this.tray.setToolTip(this.dict.no_running_tasks)
        })
        ipcMain.on('request-end', async (event, id) => {
            await this.model.timerEnd(id)
            this.win.webContents.send('success-end')
            this.tray.setToolTip(this.dict.no_running_tasks)
        })
        ipcMain.on('request-timer', async (event, taskId) => {
            const timer = await this.model.getTimer(taskId)
            this.win.webContents.send('get-timer', timer)
        })
        ipcMain.on('save-language', async (event, lang) => {
            await this.model.setLanguage(lang)
            this.win.webContents.send('success-language')
        })
        ipcMain.on('save-task', async (event, id) => {
            await this.model.setTask(id)
            this.win.webContents.send('success-task')
        })
        ipcMain.on('update-timer', async (event, args) => {
            this.tray.setToolTip(`${args.task.name}: ${args.time}, ${args.price}`)
        })
    }
}

new App()
