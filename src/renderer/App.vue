<template>
    <div class="app">
        <template v-if="isAppReady">
            <nav class="navbar is-fixed-top is-dark">
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <router-link
                            to="/"
                            class="navbar-item"
                            :class="{ 'is-active': $route.name === 'timer' }"
                        >{{ T('menu.timer') }}</router-link>
                        <router-link
                            to="/statistic"
                            class="navbar-item"
                            :class="{ 'is-active': $route.name === 'statistic' }"
                        >{{ T('menu.statistic') }}</router-link>
                        <router-link
                            to="/settings"
                            class="navbar-item"
                            :class="{ 'is-active': $route.name === 'settings' }"
                        >{{ T('menu.settings') }}</router-link>
                        <div class="navbar-item">
                            <div class="select">
                                <select
                                    v-model="activeTask"
                                    :disabled="timer === 'start'"
                                    :title="activeTaskName"
                                >
                                    <option value="0">{{ T('choose_task') }}</option>
                                    <option
                                        v-for="item in tasks"
                                        :key="item.id"
                                        :value="item.id"
                                    >{{ item.name }}</option>
                                </select>
                            </div>
                            <button
                                :title="T('del_current_task')"
                                class="delete has-background-danger ml-2"
                                @click="delTask"
                                v-if="activeTask > 0 && timer !== 'start'"
                            ></button>
                            <router-link
                                to="/task/add"
                                :title="T('add_new_task')"
                                class="button is-link is-rounded button--add"
                                :class="{ 'disable-pointer-events': timer === 'start' }"
                                :disabled="timer === 'start'"
                            >+</router-link>
                        </div>
                        <div class="navbar-item">
                            <div class="select select--lang">
                                <select @change="changeLanguage($event)">
                                    <option
                                        v-for="lang in cst.languages"
                                        :value="lang"
                                        :selected="lang === setting('language')"
                                    >{{ lang }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <button class="button is-danger" @click="close">{{ T('exit') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <section :class="{ 'section': $route.name !== 'timer' }">
                <keep-alive>
                    <router-view :key="$route.path" />
                </keep-alive>
            </section>
            <div class="modal is-active" v-if="warningModal.show">
                <div class="modal-background" @click="warningModal.show = false"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{{ warningModal.title }}</p>
                        <button class="delete" aria-label="close" @click="warningModal.show = false"></button>
                    </header>
                    <section class="modal-card-body" v-if="warningModal.description.length > 0">{{ warningModal.description }}</section>
                    <footer class="modal-card-foot">
                        <button
                            class="button is-danger"
                            :disabled="warningModal.type === 'delTask' && timerValues.seconds > 0"
                            @click="action"
                        >{{ T('yes') }}</button>
                        <button class="button" @click="warningModal.show = false">{{ T('no') }}</button>
                    </footer>
                </div>
            </div>
        </template>
        <Preloader v-else />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as type from '@/store/mutations-type'
import Preloader from '@/components/Preloader'

export default {
    name: 'App',
    data() {
        return {
            isAppReady: false,
            warningModal: {
                type: '',
                title: '',
                description: '',
                show: false
            }
        }
    },
    computed: {
        ...mapState([
            'tasks',
            'timer',
            'timerValues'
        ]),
        ...mapGetters([
            'setting'
        ]),
        activeTask: {
            get() {
                return this.$store.state.activeTask
            },
            set(id) {
                this.$store.dispatch('setActiveTask', parseInt(id))
            }
        },
        activeTaskName() {
            const task = this.tasks.find(el => el.id === this.activeTask)
            if (task) return task.name
            return this.T('choose_task')
        }
    },
    components: {
        Preloader
    },
    async created() {
        await this.$store.dispatch('getSettings')
        await this.$store.dispatch('dict')
        await this.$store.dispatch('getTasks')
        await this.$store.dispatch('getStatistic')
        if (this.setting('task_id')) this.activeTask = this.setting('task_id')
        window.electron.on('close', event => {
            this.close()
        })
        this.isAppReady = true
    },
    methods: {
        close() {
            if (this.timer === 'start') {
                Object.assign(this.warningModal, {
                    type: 'close',
                    title: this.T('close_application'),
                    description: this.T('timer_start_warning'),
                    show: true
                })
            } else {
                window.electron.send('close-window')
            }
        },
        delTask() {
            let description = ''
            if (this.timerValues.seconds > 0) {
                description = this.T('del_task_timer_warning')
            }
            Object.assign(this.warningModal, {
                type: 'delTask',
                title: this.T('del_task'),
                description,
                show: true
            })
        },
        resetModal() {
            Object.assign(this.warningModal, {
                type: '',
                title: '',
                description: '',
                show: false
            })
        },
        async action() {
            if (this.warningModal.type === 'delTask') {
                await this.$store.dispatch('delTask', this.activeTask)
                this.resetModal()
            } else if (this.warningModal.type === 'close') {
                await this.$store.dispatch('stop')
                window.electron.send('close-window')
            }
        },
        async changeLanguage(event) {
            const lang = event.target.value
            await this.$store.dispatch('setLanguage', lang)
        }
    }
}
</script>
