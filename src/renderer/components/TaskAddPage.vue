<template>
    <form @submit.prevent="add">
        <div class="field">
            <label class="label">{{ T('task.task') }}</label>
            <div class="control">
                <input
                    class="input"
                    type="text"
                    :placeholder="T('task.name')"
                    ref="field"
                    v-model="task"
                >
            </div>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <button class="button is-link" :disabled="task.length === 0 || isSaving">{{ T('add') }}</button>
            </div>
            <div class="control">
                <router-link to="/" class="button is-link is-light">{{ T('cancel') }}</router-link>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'TaskAddPage',
    data() {
        return {
            task: '',
            isSaving: false
        }
    },
    activated() {
        this.task = ''
        this.$refs.field.focus()
    },
    methods: {
        async add() {
            if (this.task.length === 0 || this.isSaving) return
            this.isSaving = true
            await this.$store.dispatch('addTask', this.task)
            this.isSaving = false
            this.$router.push('/')
        }
    }
}
</script>
