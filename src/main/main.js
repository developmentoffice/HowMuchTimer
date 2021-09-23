const path = require('path')
const {
    app,
    BrowserWindow,
    Tray,
    screen,
    ipcMain,
    Menu,
    nativeImage
} = require('electron')
const Model = require('../../db/model.js')
if (require('electron-squirrel-startup')) return app.quit()

class App
{
    constructor()
    {
        this.debug = true
        this.winWidth = 800
        this.winHeight = 400
        this.win = null
        this.tray = null
        this.model = new Model()
        this.dict = {}
        this.activeTask = ''
        this.isTaskRunning = false

        app.whenReady()
            .then(async () => {
                this.createWindow()
                this.initEvents()
                this.initDBEvents()
                this.initTray()
                await this.getDict()
                await this.getActiveTaskName()
        })
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit()
        })
    }
    initTray()
    {
        this.tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../../images/icons/16.png')))
    }
    trayContextMenu()
    {
        let template = []
        template.push({
            label: this.dict.restore_window,
            click: () => {
                this.win.show()
            }
        })
        if (this.activeTask.length > 0) {
            template.push({ type: 'separator' })
            if (this.isTaskRunning) {
                template.push({
                    label: `${this.dict.timer_pause}: ${this.activeTask}`,
                    click: () => {
                        this.win.webContents.send('timer-pause')
                    }
                })
            } else {
                template.push({
                    label: `${this.dict.timer_start}: ${this.activeTask}`,
                    click: () => {
                        this.win.webContents.send('timer-start')
                    }
                })
                template.push({
                    label: `${this.dict.timer_end}: ${this.activeTask}`,
                    click: () => {
                        this.win.show()
                        this.win.webContents.send('timer-end')
                    }
                })
            }
        }
        template.push({ type: 'separator' })
        template.push({
            label: this.dict.exit,
            click: () => {
                this.onCloseApp()
            }
        })

        const contextMenu = Menu.buildFromTemplate(template)
        this.tray.setContextMenu(contextMenu)
    }
    createWindow()
    {
        const screenSize = screen.getPrimaryDisplay().size
        this.win = new BrowserWindow({
            width: this.winWidth,
            height: this.winHeight,
            x: screenSize.width - this.winWidth,
            y: 0,
            icon: nativeImage.createFromPath(path.join(__dirname, '../../images/icons/512.png')),
            resizable: false,
            minimizable: true,
            maximizable: false,
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(__dirname, '../renderer/preload.js')
            }
        })
        this.win.removeMenu()
        this.win.loadFile('src/renderer/index.html')
        this.win.on('restore', event => {
            this.win.setSize(this.winWidth, this.winHeight)
        })
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
    getActiveTaskName()
    {
        return new Promise((resolve, reject) => {
            ipcMain.on('active-task-name', (event, name) => {
                this.activeTask = name
                if (process.platform === 'win32') this.trayContextMenu()
                resolve()
            })
        })
    }
    initDBEvents()
    {
        ipcMain.handle('settings', async (event) => {
            const settings = await this.model.getSettings()
            return settings
        })
        ipcMain.handle('settings-save', async (event, args) => {
            await this.model.setSettings(args)
            return true
        })
        ipcMain.handle('tasks', async (event) => {
            const tasks = await this.model.getTasks()
            return tasks
        })
        ipcMain.handle('tasks-add', async (event, task) => {
            const taskId = await this.model.addTask(task)
            return taskId
        })
        ipcMain.handle('tasks-del', async (event, id) => {
            await this.model.delTask(id)
            return true
        })
        ipcMain.handle('tasks-active', async (event, id) => {
            await this.model.setTask(id)
            return true
        })
        ipcMain.handle('timer', async (event, taskId) => {
            const timer = await this.model.getTimer(taskId)
            return timer
        })
        ipcMain.handle('timer-start', async (event, args) => {
            const timerId = await this.model.timerStart(args)
            this.isTaskRunning = true
            if (process.platform === 'win32') this.trayContextMenu()
            return timerId
        })
        ipcMain.handle('timer-stop', async (event, args) => {
            await this.model.timerStop(args)
            this.isTaskRunning = false
            this.tray.setToolTip(this.dict.no_running_tasks)
            if (process.platform === 'win32') this.trayContextMenu()
            return true
        })
        ipcMain.handle('timer-end', async (event, id) => {
            await this.model.timerEnd(id)
            this.tray.setToolTip(this.dict.no_running_tasks)
            return true
        })
        ipcMain.on('timer-update', async (event, args) => {
            this.tray.setToolTip(`${args.task.name}: ${args.time}, ${args.price}`)
        })
        ipcMain.handle('statistic', async (event) => {
            const statistic = await this.model.getStatistic()
            return statistic
        })
        ipcMain.handle('language-save', async (event, lang) => {
            await this.model.setLanguage(lang)
            return true
        })
    }
}

new App()
