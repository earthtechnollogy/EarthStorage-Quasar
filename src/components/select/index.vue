<script>
import { Table } from 'nucleo-quasar'
import NForm from 'nucleo-quasar/src/components/form'

import EarthStorage from '../EarthStorage'

export default {
  name: 'EarthStorageSelect',
  components: { NForm, EarthStorage },
  props: {
    value: { required: true },
    table: { type: Table, required: true },

    folder: { type: String, default: null },
    apiKey: { type: String, required: true },
    multiple: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false,
    modelFolder: null
  }),
  created () { this.modelFolder = this.folder },
  computed: {
    model: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    storage () { return this.$refs.storage }
  },
  methods: {
    submitFn () {
      this.resetFn()
      this.table.modal = false
    },
    resetFn () {
      this.loading = false
    },

    loadingFn (loading) {
      this.loading = !!loading
    }
  },
  watch: {
    'modelFolder' (value) {
      if ((value || '').startsWith(this.folder)) return
      this.modelFolder = this.folder
    },
    'folder' (value) { this.modelFolder = value },
    'storage' (value) { if (value) this.storage.updateFn() }
  }
}
</script>

<template>
  <n-form v-model="table.modal" title="EarthStorage" ok="Continuar" :no-ok="!(model && model.length)" no-cancel min-width="65vw"
    @submit="submitFn" @hide="resetFn">

    <div class="earth-storage-select col-12">
      <earth-storage ref="storage" v-model="modelFolder" type="select" :select.sync="model" :multiple="multiple" :api-key="apiKey"
        no-loading no-query-folder @loading-show="loadingFn(true)" @loading-hide="loadingFn(false)"/>

      <div class="loading row flex-center" v-if="loading">
        <q-spinner-grid color="primary"/>
      </div>
    </div>

  </n-form>
</template>

<style lang="stylus">
  .earth-storage-select
    .loading
      top 0
      left 0
      width 100%
      z-index 5000
      position absolute
      height calc(100% + 55px)
      background-color rgba(#000, .8)
      .q-spinner
        font-size 6rem
</style>
