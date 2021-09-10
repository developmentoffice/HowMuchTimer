import dict from '@/config/dict'
import cst from '@/config/const'
import store from '@/store'

export default {
    data() {
        return {
            cst
        }
    },
    methods: {
        T(key) {
            const lang = store.getters.setting('language')
            const val = key.split('.').reduce((acc, el) => acc[el] || '', dict[lang])
            if (val) return val
            return ''
        }
    }
}
