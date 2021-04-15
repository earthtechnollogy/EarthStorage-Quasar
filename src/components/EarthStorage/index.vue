<script>
import EarthStorage from '@earthtechnollogy/earthstorage-sdk'

import Dir from '../../domain/dir'
import EarthStorageDir from '../dir'
import EarthStorageBtn from '../btn'
import EarthStorageFile from '../file'

const storage = new EarthStorage()

export default {
  name: 'EarthStorage',
  components: { EarthStorageDir, EarthStorageBtn, EarthStorageFile },
  props: {
    value: { type: String, default: null },

    type: {
      type: String,
      default: 'dir',
      validator: (val) => ['dir', 'select'].includes(val)
    },
    multiple: { type: Boolean, default: false },
    select: { type: [String, Array], default: null },

    apiKey: { type: String, required: true },
    noLoading: { type: Boolean, default: false },
    noQueryFolder: { type: Boolean, default: false }
  },
  data: () => ({
    dir: []
  }),
  created () {
    if (!this.noQueryFolder) this.folder = this.$route.query.folder || null
    this.updateFn()
  },
  computed: {
    folder: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    selects: {
      get () {
        if (!this.select) return []
        return this.multiple ? this.select : [this.select]
      },
      set (val) {
        if (!this.multiple) val = val[0]
        this.$emit('update:select', val)
      }
    },
    paths () {
      if (!this.folder) return []
      return this.folder.split('/').map((x, i) => {
        return { label: x, folder: this.folder.split('/').slice(0, i + 1).join('/') }
      })
    }
  },
  methods: {
    updateFn () {
      if (!this.apiKey) return

      this.setLoadingFn(true)
      storage.setApiKey(this.apiKey)
      if (!this.noQueryFolder) this.$router.push({ query: { folder: this.folder } }).catch(() => {})
      storage.dir.list(this.folder)
        .then(dir => { this.dir = dir })
        .catch(e => this.$Msg(e.message, false))
        .finally(() => this.setLoadingFn(false))
    },

    clickDirFn (dir) {
      if (dir.type === 'folder') return this.addPathToFolderFn(dir.name)
      if (this.type === 'select') return this.selectFileFn(dir)
      this.viewFileFn(dir)
    },
    uploadFileFn (files) {
      this.setLoadingFn(true)

      files = files.map(x => {
        const dir = new Dir()
        dir.name = x.name
        dir.type = x.type
        dir.folder = this.folder
        dir.dataUrl = x.dataUrl

        return storage.dir.add(dir)
      })

      Promise.all(files)
        .then(messages => this.$Msg(messages[0]))
        .catch(e => this.$Msg(e.message, false))
        .finally(() => this.updateFn())
    },
    createFolderFn () {
      this.$Alert('Criar Pasta', '', { prompt: { model: '', type: 'text' } })
        .onOk(name => {
          this.setLoadingFn(true)

          const dir = new Dir()
          dir.name = name
          dir.type = 'folder'
          dir.folder = this.folder

          storage.dir.add(dir)
            .then(message => this.$Msg(message))
            .catch(e => this.$Msg(e.message, false))
            .finally(() => this.updateFn())
        })
    },
    async downloadFn (dir) {
      this.setLoadingFn(true)

      const blob = await storage.files.get(dir.href)
      const fileReader = new FileReader()
      fileReader.readAsDataURL(blob)
      fileReader.onload = (e) => {
        const a = document.createElement('a')
        a.href = e.target.result
        a.download = dir.name
        a.click()

        this.$q.loading.hide()
      }
    },
    deleteFn (dir) {
      storage.dir.delete(dir)
        .then(message => this.$Msg(message))
        .catch(e => this.$Msg(e.message, false))
        .finally(() => this.updateFn())
    },

    setLoadingFn (loading) {
      loading = loading ? 'show' : 'hide'
      if (this.noLoading) return this.$emit(`loading-${loading}`)
      this.$q.loading[loading]()
    },
    addPathToFolderFn (path) {
      if (!this.folder) this.folder = path
      else this.folder += '/' + path
    },
    viewFileFn (file) {
      window.open(file.href)
    },
    selectFileFn (file) {
      let selects = JSON.parse(JSON.stringify(this.selects))
      const index = selects.findIndex(x => x === file.href)
      if (index > -1) selects.splice(index, 1)
      else {
        if (this.multiple) selects.push(file.href)
        else selects = [file.href]
      }
      this.selects = selects
    }
  },
  watch: {
    folder () { this.updateFn() },
    apiKey () { this.updateFn() },
    '$route.query.folder' () { if (!this.noQueryFolder) this.folder = this.$route.query.folder || null }
  }
}
</script>

<template>
  <div class="earth-storage">

    <div class="options row">
      <earth-storage-file multiple @input="uploadFileFn"/>
      <earth-storage-btn label="Criar Pasta" icon="eva-folder-outline" @click="createFolderFn"/>
    </div>

    <div class="folders">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" @click="folder = null"  class="cursor-pointer"/>
        <q-breadcrumbs-el v-for="path in paths" :key="path.label"
          :label="path.label" @click="folder = path.folder" class="cursor-pointer"/>
      </q-breadcrumbs>
    </div>

    <div class="container row" v-if="dir.length">
      <div v-for="d in dir" :key="d.folder + d.name">
        <earth-storage-dir :metadata="d" :selected="!!selects.find(x => x === d.href)" @click="clickDirFn(d)"/>
        <q-menu context-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="viewFileFn(d)">
              <q-item-section avatar>
                <q-icon name="visibility"/>
              </q-item-section>
              <q-item-section>Visualizar</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="downloadFn(d)" v-if="d.type !== 'folder'">
              <q-item-section avatar>
                <q-icon name="download"/>
              </q-item-section>
              <q-item-section>Fazer Download</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="deleteFn(d)">
              <q-item-section avatar>
                <q-icon name="delete"/>
              </q-item-section>
              <q-item-section>Deletar</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>

    <div class="empty row flex-center" v-else>
      Nada no momento
    </div>

  </div>
</template>

<style lang="stylus">
  .earth-storage
    .options
      padding 1rem
      padding-left 0
      .sh-file
        width 300px
      .q-btn
        padding 0 1rem
        margin-left 1rem
    .folders
      padding 0 1rem
      .q-breadcrumbs
        padding 1rem
        font-size 1.8rem
        border-radius 1rem
        border 1px solid $grey-5
    .empty
      width 100%
      height 50vh
      font-size 2rem
      font-weight 700
      text-transform uppercase
</style>
