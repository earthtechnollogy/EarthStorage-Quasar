<script>
export default {
  name: 'EarthBtn',
  props: {
    icon: { Type: String, default: null },
    label: { Type: String, default: null },
    loading: { Type: Boolean, default: false }
  },
  methods: {
    clickFn () { this.$emit('click') }
  }
}
</script>

<template>
  <q-btn :label="label" :icon="icon" :loading="loading" color="primary" @click="clickFn">
    <slot/>
  </q-btn>
</template>

<style lang="stylus">
  .q-btn
    font-size 1.35rem
</style>
