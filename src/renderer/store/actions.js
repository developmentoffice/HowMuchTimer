import * as type from '@/store/mutations-type'
import mixins from '@/mixins/global'

export default {
    async getSettings({ commit }) {
        const settings = await window.electron.invoke('settings')
        commit(type.SET_SETTINGS, settings)
    },
    async setSettings({ commit, dispatch }, args) {
        await window.electron.invoke('settings-save', args)
        dispatch('getSettings')
    },
    async getTasks({ commit }) {
        const tasks = await window.electron.invoke('tasks')
        commit(type.SET_TASKS, tasks)
    },
    async addTask({ commit, dispatch }, task) {
        const taskId = await window.electron.invoke('tasks-add', task)
        dispatch('getTasks')
        dispatch('setActiveTask', taskId)
        commit(type.RESET_TIMER)
    },
    async delTask({ commit, dispatch }, id) {
        await window.electron.invoke('tasks-del', id)
        dispatch('setActiveTask', 0)
        dispatch('getTasks')
    },
    async setActiveTask({ commit, dispatch }, id) {
        commit(type.SET_ACTIVE_TASK, id)
        if (id !== 0) {
            dispatch('getTimerValues')
        } else {
            commit(type.RESET_TIMER)
        }
        await window.electron.invoke('tasks-active', id)
        dispatch('activeTaskName')
    },
    async activeTaskName({ state })
    {
        return new Promise((resolve, reject) => {
            let name = ''
            if (state.activeTask === 0) name = ''
            else {
                const task = state.tasks.find(el => el.id === state.activeTask)
                name = task.name
            }
            window.electron.send('active-task-name', name)
            resolve()
        })
    },
    async start({ commit, getters, state }) {
        const timerId = await window.electron.invoke('timer-start', {
            taskId: state.activeTask,
            price: getters.priceSettings.val
        })
        commit(type.START_TIMER)
        commit(type.SET_ACTIVE_TASK_TIMER_ID, timerId)
    },
    async stop({ commit, state, dispatch }) {
        await window.electron.invoke('timer-stop', {
            timerId: state.activeTaskTimerId,
            seconds: state.seconds
        })
        commit(type.STOP_TIMER)
        dispatch('getTimerValues')
        dispatch('getStatistic')
    },
    async end({ commit, dispatch, state }) {
        await window.electron.invoke('timer-end', state.activeTask)
        dispatch('setActiveTask', 0)
        dispatch('getTasks')
        dispatch('getStatistic')
    },
    updateTimer({ commit, getters, state}, seconds) {
        commit(type.SET_SECONDS, seconds)
        const s = seconds + state.timerValues.seconds
        if (s % 10 === 0) {
            const task = state.tasks.find(el => el.id === state.activeTask)
            const price = getters.priceSettings
            if (task) {
                const args = {
                    task,
                    time: getters.time,
                    price: (state.timerValues.price + price.val / 3600 * seconds).toFixed(2) + ' ' + mixins.methods.T(price.dim)
                }
                window.electron.send('timer-update', args)
            }
        }
    },
    async getTimerValues({ commit, state }) {
        const timer = await window.electron.invoke('timer', state.activeTask)
        commit(type.RESET_TIMER)
        commit(type.SET_TIMER_VALUES, timer)
    },
    async getStatistic({ commit }) {
        const statistic = await window.electron.invoke('statistic')
        commit(type.SET_STATISTIC, statistic)
    },
    async setLanguage({ commit, dispatch }, lang) {
        await window.electron.invoke('language-save', lang)
        await dispatch('getSettings')
        dispatch('dict')
    },
    async dict() {
        return new Promise((resolve, reject) => {
            window.electron.send('dict', {
                no_running_tasks: mixins.methods.T('no_running_tasks'),
                exit: mixins.methods.T('exit'),
                restore_window: mixins.methods.T('restore_window'),
                timer_start: mixins.methods.T('timer.start'),
                timer_pause: mixins.methods.T('timer.pause'),
                timer_end: mixins.methods.T('timer.end')
            })
            resolve()
        })
    }
}
