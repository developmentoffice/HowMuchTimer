import { timeFormat } from '@/helpers'

export default {
    priceSettings(state) {
        const setting = state.settings.find(el => el.key === 'hour_price')
        if (setting) {
            return {
                val: parseFloat(setting.value),
                dim: setting.dimension
            }
        }
        return null
    },
    setting(state) {
        return key => state.settings.find(el => el.key === key).value
    },
    time(state) {
        return timeFormat((state.seconds + state.timerValues.seconds))
    },
    editableSettings(state) {
        return state.settings.filter(el => ['language', 'task_id'].indexOf(el.key) === -1)
    },
    statisticSummary(state) {
        let ret = []
        let id = 0
        let totalPrice = 0
        let totalSeconds = 0
        state.statistic.forEach(el => {
            if (el.id !== id) {
                if (ret.length > 0) {
                    ret.push({
                        totalPrice: totalPrice.toFixed(2),
                        totalSeconds
                    })
                }
                totalPrice = 0
                totalSeconds = 0
            }
            ret.push(el)
            totalPrice += parseFloat(el.price / 3600 * el.seconds)
            totalSeconds += parseInt(el.seconds)
            id = el.id
        })
        if (ret.length > 0) ret.push({
            totalPrice: totalPrice.toFixed(2),
            totalSeconds
        })
        return ret
    }
}
