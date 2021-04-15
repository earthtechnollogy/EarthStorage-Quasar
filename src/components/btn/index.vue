<script>
export default {
  name: 'EarthStorageBtn',
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
  <div class="earth-storage-btn">
    <q-btn :label="label" :icon="icon" :loading="loading" color="primary" @click="clickFn">
      <slot/>
    </q-btn>
  </div>
</template>

<style lang="stylus">
  .earth-storage-btn
    .q-btn
      font-size 1.35rem
</style>
