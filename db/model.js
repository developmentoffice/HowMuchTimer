const { access, constants, writeFile } = require('fs')
const sqlite3 = require('better-sqlite3')
const { app } = require('electron')

class Model
{
    constructor()
    {
        const dbFile = app.getPath('userData') + '/data.db'
        access(dbFile, constants.F_OK, (err) => {
            if (err) {
                writeFile(dbFile, '', (err) => {
                    if (!err) {
                        this.db = new sqlite3(dbFile)
                        this.initDB()
                    }
                })
            } else {
                this.db = new sqlite3(dbFile)
            }
        })
    }
    initDB()
    {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY,
                key TEXT NOT NULL UNIQUE,
                value TEXT,
                dimension VARCHAR(10)
            )
        `).run()
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                name TEXT,
                is_end BOOLEAN
            )
        `).run()
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS timer (
                id INTEGER PRIMARY KEY,
                task_id INTEGER,
                seconds INTEGER,
                price NUMERIC,
                dt DATETIME,
                FOREIGN KEY (task_id) REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE
            )
        `).run()
        this.db.prepare('INSERT INTO settings(key, value, dimension) VALUES($key, $value, $dimension)').run({
            key: 'hour_price',
            value: '10',
            dimension: 'currency'
        })
        this.db.prepare('INSERT INTO settings(key, value) VALUES($key, $value)').run({
            key: 'language',
            value: 'eng'
        })
        this.db.prepare('INSERT INTO settings(key, value) VALUES($key, $value)').run({
            key: 'task_id',
            value: '0'
        })
    }
    getSettings()
    {
        return new Promise((resolve, reject) => {
            try {
                const rows = this.db.prepare('SELECT * FROM settings').all()
                resolve(rows)
            } catch(e) {
                reject()
            }
        })
    }
    setSettings(args)
    {
        return new Promise((resolve, reject) => {
            try {
                const run = this.db.prepare('UPDATE settings SET value=$value WHERE key=$key').run({
                    value: args.value,
                    key: args.key
                })
                resolve()
            } catch (e) {
                reject(e.message)
            }
        })
    }
    getTasks()
    {
        return new Promise((resolve, reject) => {
            try {
                const rows = this.db.prepare('SELECT * FROM tasks WHERE is_end=false').all()
                resolve(rows)
            } catch (e) {
                reject()
            }
        })
    }
    addTask(task)
    {
        return new Promise((resolve, reject) => {
            try {
                const run = this.db.prepare('INSERT INTO tasks (name, is_end) VALUES($name, false)').run({
                    name: task
                })
                resolve(run.lastInsertRowid)
            } catch(e) {
                reject(e.message)
            }
        })
    }
    delTask(id)
    {
        return new Promise((resolve, reject) => {
            try {
                this.db.prepare('DELETE FROM tasks WHERE id=$id').run({
                    id: id
                })
                resolve()
            } catch(e) {
                reject()
            }
        })
    }
    timerStart(args)
    {
        return new Promise((resolve, reject) => {
            try {
                const run = this.db.prepare("INSERT INTO timer (task_id, price, dt) VALUES($task_id, $price, datetime('now', 'localtime'))").run({
                    task_id: args.taskId,
                    price: args.price
                })
                resolve(run.lastInsertRowid)
            } catch(e) {
                reject()
            }
        })
    }
    timerStop(args)
    {
        return new Promise((resolve, reject) => {
            try {
                this.db.prepare('UPDATE timer SET seconds=$seconds WHERE id=$id').run({
                    id: args.timerId,
                    seconds: args.seconds
                })
                resolve()
            } catch(e) {
                reject()
            }
        })
    }
    timerEnd(id)
    {
        return new Promise((resolve, reject) => {
            try {
                this.db.prepare('UPDATE tasks SET is_end=true WHERE id=$id').run({
                    id: id
                })
                resolve()
            } catch(e) {
                reject()
            }
        })
    }
    getTimer(taskId)
    {
        return new Promise((resolve, reject) => {
            try {
                const rows = this.db.prepare('SELECT seconds, price FROM timer WHERE task_id=$task_id').all({
                    task_id: taskId
                })
                let seconds = 0
                let price = 0
                rows.forEach(el => {
                    let s = parseInt(el.seconds) || 0
                    let p = parseFloat(el.price) || 0
                    seconds += s
                    price += parseFloat((s * p / 3600).toFixed(2))
                })
                resolve({
                    seconds,
                    price
                })
            } catch(e) {
                reject(e)
            }
        })
    }
    getStatistic()
    {
        return new Promise((resolve, reject) => {
            try {
                const rows = this.db.prepare(`SELECT tasks.id, tasks.name, tasks.is_end, timer.seconds, timer.price, timer.dt
                FROM tasks
                LEFT JOIN timer ON timer.task_id = tasks.id
                WHERE timer.seconds > 0
                ORDER BY timer.task_id, timer.dt`).all()
                resolve(rows)
            } catch(e) {
                reject()
            }
        })
    }
    setLanguage(lang)
    {
        return new Promise((resolve, reject) => {
            try {
                const run = this.db.prepare('UPDATE settings SET value=$value WHERE key=$key').run({
                    value: lang,
                    key: 'language'
                })
                resolve()
            } catch (e) {
                reject(e.message)
            }
        })
    }
    setTask(id)
    {
        return new Promise((resolve, reject) => {
            try {
                const run = this.db.prepare('UPDATE settings SET value=$value WHERE key=$key').run({
                    value: id,
                    key: 'task_id'
                })
                resolve()
            } catch (e) {
                reject(e.message)
            }
        })
    }
}

module.exports = Model
