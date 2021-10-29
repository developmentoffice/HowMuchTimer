import Vue from 'vue'
import App from './App'
import router from '@/config/router'
import store from '@/store'

import date from '@/filters/date'
Vue.filter('date', date)

import globalMixin from '@/mixins/global'
Vue.mixin(globalMixin)

import VueScrollTo from 'vue-scrollto'
Vue.use(VueScrollTo, {
    container: 'body',
    duration: 500,
    easing: 'ease',
    offset: -60,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true
})

window.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    })
})
