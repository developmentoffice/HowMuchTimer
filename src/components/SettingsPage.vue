<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>{{ T('settings.setting') }}</th>
                    <th>{{ T('settings.value') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in editableSettings"
                    :key="item.id"
                    @click="startEdit(item)"
                    :title="T('settings.click_edit')"
                >
                    <td>{{ T(item.key) }}</td>
                    <td class="is-flex is-align-items-center">
                        <div
                            class="control is-small"
                            :class="{ 'is-loading': isSaving }"
                            v-if="edit === item.key"
                        >
                            <input
                                class="input is-small"
                                type="text"
                                @keyup="save"
                                @blur="endEdit"
                                ref="field"
                                v-model="model"
                            >
                        </div>
                        <template v-else>{{ item.value }}</template>
                        <div class="ml-1" v-if="item.dimension">{{ T(item.dimension) }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="modal is-active" v-if="warningModal">
            <div class="modal-background" @click="warningModal = false"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ T('error') }}</p>
                    <button class="delete" aria-label="close" @click="warningModal = false"></button>
                </header>
                <section class="modal-card-body">
                    {{ T('settings.edit_warning') }}
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-danger" @click="warningModal = false">{{ T('close') }}</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'SettingsPage',
    data() {
        return {
            edit: '',
            model: '',
            warningModal: false,
            isSaving: false
        }
    },
    computed: {
        ...mapState([
            'timer'
        ]),
        ...mapGetters([
            'editableSettings'
        ])
    },
    methods: {
        startEdit(item) {
            if (this.timer === 'start') {
                this.warningModal = true
                return
            }
            this.edit = item.key
            this.model = item.value
            this.$nextTick(() => this.$refs.field[0].focus())
        },
        endEdit() {
            if (this.isSaving) return
            this.edit = ''
            this.model = ''
        },
        async save() {
            this.isSaving = true
            await this.$store.dispatch('setSettings', {
                key: this.edit,
                value: this.model
            })
            this.isSaving = false
        }
    }
}
</script>
