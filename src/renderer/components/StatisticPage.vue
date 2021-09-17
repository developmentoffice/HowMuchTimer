<template>
    <table class="table is-narrow">
        <thead>
            <tr>
                <th>{{ T('statistic.task') }}</th>
                <th>{{ T('statistic.date') }}</th>
                <th>{{ T('statistic.time') }}</th>
                <th>{{ T('statistic.price') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="item in statisticSummary"
                :class="{ 'has-background-primary-light': item.is_end }"
                :title="item.is_end ? T('end_task') : ''"
            >
                <template v-if="item.totalPrice">
                    <td colspan="4" class="has-text-centered has-background-link-light">
                        <strong>{{ T('total') }}: {{ timeFormat(item.totalSeconds) }} ({{ item.totalPrice }} {{ T(priceSettings.dim) }})</strong>
                    </td>
                </template>
                <template v-else>
                    <td>{{ item.name }}</td>
                    <td>{{ item.dt | date }}</td>
                    <td>{{ timeFormat(item.seconds) }}</td>
                    <td>{{ item.price }} {{ T(priceSettings.dim) }}</td>
                </template>
            </tr>
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
            timeFormat
        }
    },
    computed: {
        ...mapGetters([
            'priceSettings',
            'statisticSummary'
        ])
    }
}
</script>
