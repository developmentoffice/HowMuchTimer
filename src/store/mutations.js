import * as type from '@/store/mutations-type'

export default {
    [type.SET_SETTINGS] (state, value) {
        state.settings = value
    },
    [type.SET_TASKS] (state, value) {
        state.tasks = value
    },
    [type.SET_STATISTIC] (state, value) {
        state.statistic = value
    },
    [type.SET_ACTIVE_TASK] (state, value) {
        state.activeTask = value
    },
    [type.RESET_TIMER] (state) {
        state.timer = ''
        state.seconds = 0
        state.timerValues = {
            seconds: 0,
            price: 0
        }
    },
    [type.STOP_TIMER] (state) {
        state.timer = 'stop'
    },
    [type.START_TIMER] (state) {
        state.timer = 'start'
    },
    [type.SET_SECONDS] (state, value) {
        state.seconds = value
    },
    [type.SET_ACTIVE_TASK_TIMER_ID] (state, value) {
        state.activeTaskTimerId = value
    },
    [type.SET_TIMER_VALUES] (state, value) {
        state.timerValues = value
    }
}
