<template>
    <table class="table is-narrow is-hoverable">
        <thead>
            <tr>
                <th>{{ T('statistic.task') }}</th>
                <th>{{ T('statistic.date') }}</th>
                <th>{{ T('statistic.time') }}</th>
                <th>{{ T('statistic.price') }}</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="item in statisticSummary">
                <tr
                    class="toggle-row"
                    :class="[
                        'toggle-row',
                        `task-${item.id}`,
                        {
                            'has-background-primary-light': item.isEnd,
                            'has-background-danger-light': openId === item.id
                        }
                    ]"
                    :title="item.isEnd ? T('end_task') : T('task_statistics')"
                    @click="toggleStatistics(item.id)"
                >
                    <td><strong>{{ item.name }}</strong></td>
                    <td><strong>{{ item.startDate | date }}<br>{{ item.endDate | date }}</strong></td>
                    <td><strong>{{ timeFormat(item.totalSeconds) }}</strong></td>
                    <td><strong>{{ item.totalPrice }} {{ T(priceSettings.dim) }}</strong></td>
                </tr>
                <template v-if="openId === item.id">
                    <tr
                        class="has-background-light"
                        v-for="el in item.items"
                    >
                        <td>&nbsp;</td>
                        <td>{{ el.dt | date }}</td>
                        <td>{{ timeFormat(el.seconds) }}</td>
                        <td>{{ el.price }} {{ T(priceSettings.dim) }}</td>
                    </tr>
                </template>
            </template>
        </tbody>
    </table>
</template>

<script>
import { mapGetters } from 'vuex'
import { timeFormat } from '@/helpers'

export default {
    name: 'StatisticPage',
    data() {
        return {
            timeFormat,
            openId: null
        }
    },
    computed: {
        ...mapGetters([
            'priceSettings',
            'statisticSummary'
        ])
    },
    methods: {
        toggleStatistics(id) {
            if (this.openId === id) this.openId = null
            else this.openId = id
            this.$nextTick(() => {
                this.$scrollTo(`.task-${id}`)
            })
        }
    }
}
</script>
