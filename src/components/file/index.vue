<script>
import EarthBtn from '../btn'

export default {
  name: 'ShFile',
  components: { EarthBtn },
  props: {
    value: { default: null },

    accept: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    icon: { type: String, default: 'las la-file-upload' },
    label: { type: String, default: 'Upload de arquivo(s)' }
  },
  data: () => ({
    loading: false
  }),
  computed: {
    model: {
      get () {
        if (!this.value) return []
        return this.multiple ? this.value : [this.value]
      },
      set (val) {
        if (!this.multiple) val = val[0]
        this.$emit('input', val)
      }
    }
  },
  methods: {
    uploadFn (e) {
      this.loading = true

      const files = []
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i])
      }
      Promise.all(files.map(x => this.readFileFn(x)))
        .then(files => {
          this.loading = false
          this.model = [...this.model, ...files]
        })
    },
    readFileFn (file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = (e) => {
          file.dataUrl = e.target.result
          resolve(file)
        }
        fileReader.onerror = (e) => reject(fileReader.error)
      })
    }
  }
}
</script>

<template>
  <earth-btn :label="label" :icon="icon" :loading="loading">
    <label for="input-sh-file" class="label"></label>
    <input id="input-sh-file" type="file" :accept="accept" :multiple="multiple" @change="uploadFn" class="file" v-if="!loading"/>
  </earth-btn>
</template>

<style lang="stylus" scoped>
  .q-btn
    width 100%
    .label
      width 100%
      height 100%
      cursor pointer
      position absolute
    .file
      display none
</style>
