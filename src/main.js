import Vue from 'vue'
import App from './App'
import router from '@/config/router'
import store from '@/store'

import date from '@/filters/date'
Vue.filter('date', date)

import globalMixin from '@/mixins/global'
Vue.mixin(globalMixin)

window.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    })
})
