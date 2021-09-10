import * as type from '@/store/mutations-type'
import mixins from '@/mixins/global'

const action = (label, preffix = {}, args = null) => {
    return new Promise((resolve, reject) => {
        window.ipcRenderer.send(`${preffix.send}-${label}`, args)
        window.ipcRenderer.on(`${preffix.on}-${label}`, (event, data = null) => {
            resolve(data)
        })
    })
}

export default {
    async getSettings({ commit }) {
        const settings = await action('settings', { send: 'request', on: 'get' })
        commit(type.SET_SETTINGS, settings)
    },
    async setSettings({ commit, dispatch }, args) {
        await action('setting', { send: 'save', on: 'success' }, args)
        dispatch('getSettings')
    },
    async getTasks({ commit }) {
        const tasks = await action('tasks', { send: 'request', on: 'get' })
        commit(type.SET_TASKS, tasks)
    },
    async addTask({ commit, dispatch }, task) {
        const taskId = await action('task', { send: 'add', on: 'success' }, task)
        dispatch('getTasks')
        commit(type.SET_ACTIVE_TASK, taskId)
        commit(type.RESET_TIMER)
    },
    async delTask({ commit, dispatch }, id) {
        await action('task', { send: 'del', on: 'success' }, id)
        commit(type.SET_ACTIVE_TASK, 0)
        commit(type.RESET_TIMER)
        dispatch('getTasks')
    },
    async start({ commit, getters, state }) {
        const timerId = await action('start', { send: 'request', on: 'get' }, {
            taskId: state.activeTask,
            price: getters.priceSettings.val
        })
        commit(type.START_TIMER)
        commit(type.SET_ACTIVE_TASK_TIMER_ID, timerId)
    },
    async stop({ commit, state, dispatch }) {
        await action('stop', { send: 'request', on: 'success' }, {
            timerId: state.activeTaskTimerId,
            seconds: state.seconds
        })
        commit(type.STOP_TIMER)
        dispatch('getTimerValues')
        dispatch('getStatistic')
    },
    async end({ commit, dispatch, state }) {
        await action('end', { send: 'request', on: 'success' }, state.activeTask)
        commit(type.SET_ACTIVE_TASK, 0)
        commit(type.RESET_TIMER)
        dispatch('getTasks')
    },
    async getTimerValues({ commit, state }) {
        const timer = await action('timer', { send: 'request', on: 'get' }, state.activeTask)
        commit(type.RESET_TIMER)
        commit(type.SET_TIMER_VALUES, timer)

    },
    async getStatistic({ commit }) {
        const statistic = await action('statistic', { send: 'request', on: 'get' })
        commit(type.SET_STATISTIC, statistic)
    },
    async setLanguage({ commit, dispatch }, lang) {
        await action('language', { send: 'save', on: 'success' }, lang)
        await dispatch('getSettings')
        dispatch('dict')
    },
    async dict() {
        return new Promise((resolve, reject) => {
            window.ipcRenderer.send('dict', {
                no_running_tasks: mixins.methods.T('no_running_tasks')
            })
            resolve()
        })
    },
    async setActiveTask({ commit, dispatch }, id) {
        commit(type.SET_ACTIVE_TASK, id)
        if (id !== 0) {
            dispatch('getTimerValues')
        } else {
            commit(type.RESET_TIMER)
        }
        await action('task', { send: 'save', on: 'success' }, id)
    },
    updateTimer({ commit, getters, state}, seconds) {
        commit(type.SET_SECONDS, seconds)
        const s = seconds + state.timerValues.seconds
        if (s % 10 === 0) {
            const task = state.tasks.find(id => state.activeTask)
            const price = getters.priceSettings
            if (task) {
                const args = {
                    task,
                    time: getters.time,
                    price: (state.timerValues.price + price.val / 3600 * seconds).toFixed(2) + ' ' + mixins.methods.T(price.dim)
                }
                window.ipcRenderer.send('update-timer', args)
            }
        }
    }
}
