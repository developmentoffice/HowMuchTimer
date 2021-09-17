<template>
    <section class="hero is-fullheight-with-navbar">
        <div class="hero-body">
            <div class="container has-text-centered">
                <p class="title">{{ time }}</p>
                <p class="subtitle">{{ total }} {{ T(priceSettings.dim) }}</p>
            </div>
        </div>
        <div class="hero-foot">
            <div class="container has-text-centered">
                <div class="control mb-5">
                    <button
                        class="button is-large is-success mx-2"
                        :disabled="activeTask === 0"
                        v-if="timer === '' || timer === 'stop'"
                        @click="start"
                    >{{ T('timer.start') }}</button>
                    <button
                        class="button is-large is-link mx-2"
                        :disabled="activeTask === 0"
                        v-if="timer === 'start'"
                        @click="stop"
                    >{{ T('timer.pause') }}</button>
                    <button
                        class="button is-large is-danger mx-2"
                        :disabled="activeTask === 0"
                        v-if="timer === 'stop' || (timer === '' && timerValues.seconds > 0)"
                        @click="endModal = true"
                    >{{ T('timer.end') }}</button>
                </div>
            </div>
        </div>
        <div class="modal is-active" v-if="endModal">
            <div class="modal-background" @click="endModal = false"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ T('end_task_warning') }}</p>
                    <button class="delete" aria-label="close" @click="endModal = false"></button>
                </header>
                <footer class="modal-card-foot">
                    <button class="button is-danger" @click="end">{{ T('yes') }}</button>
                    <button class="button" @click="endModal = false">{{ T('no') }}</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as type from '@/store/mutations-type'

export default {
    name: 'TimerPage',
    data() {
        return {
            interval: null,
            endModal: false
        }
    },
    computed: {
        ...mapState([
            'activeTask',
            'seconds',
            'timer',
            'timerValues'
        ]),
        ...mapGetters([
            'priceSettings',
            'time'
        ]),
        total() {
            return (this.timerValues.price + this.priceSettings.val / 3600 * this.seconds).toFixed(2)
        }
    },
    methods: {
        start() {
            this.$store.dispatch('start')
            const start = Date.now()
            this.interval = setInterval(() => {
                let s = Math.floor((Date.now() - start) / 1000)
                this.$store.dispatch('updateTimer', s)
            }, 1000)
        },
        stop() {
            this.$store.dispatch('stop')
            clearInterval(this.interval)
        },
        end() {
            this.endModal = false
            this.$store.dispatch('end')
        }
    }
}
</script>
