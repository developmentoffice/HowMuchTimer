import Vue from 'vue'
import VueRouter from 'vue-router'

import TimerPage from '@/components/TimerPage'
import StatisticPage from '@/components/StatisticPage'
import SettingsPage from '@/components/SettingsPage'
import TaskAddPage from '@/components/TaskAddPage'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'timer',
        component: TimerPage
    },
    {
        path: '/statistic',
        name: 'statistic',
        component: StatisticPage
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage
    },
    {
        path: '/task/add',
        name: 'taskAdd',
        component: TaskAddPage
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router
