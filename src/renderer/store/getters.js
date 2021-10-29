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
        let items = []
        let name = ''
        let isEnd = false
        let id = 0
        let startDate = null
        let endDate = null
        let totalPrice = 0
        let totalSeconds = 0
        state.statistic.forEach(el => {
            if (el.id !== id) {
                if (items.length > 0) {
                    ret.push({
                        id,
                        name,
                        isEnd,
                        totalPrice: totalPrice.toFixed(2),
                        totalSeconds,
                        startDate,
                        endDate,
                        items
                    })
                }
                totalPrice = 0
                totalSeconds = 0
                startDate = el.dt
                endDate = null
                items = []
            }
            if (endDate === null) endDate = el.dt
            startDate = el.dt
            name = el.name
            isEnd = el.is_end
            items.push(el)
            totalPrice += parseFloat(el.price / 3600 * el.seconds)
            totalSeconds += parseInt(el.seconds)
            id = el.id
        })
        if (items.length > 0) ret.push({
            id,
            name,
            isEnd,
            totalPrice: totalPrice.toFixed(2),
            totalSeconds,
            startDate,
            endDate,
            items
        })
        return ret
    }
}
