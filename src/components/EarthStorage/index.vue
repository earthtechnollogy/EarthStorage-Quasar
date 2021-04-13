<script>
import EarthStorage from '@earthtechnollogy/earthstorage-sdk'

import EarthBtn from '../btn'
import Dir from '../../domain/dir'

const storage = new EarthStorage()

export default {
  name: 'EarthStorage',
  components: { EarthBtn },
  props: [
    folder: { type: String, default: null },
    apiKey: { type: String, required: true }
  ],
  data: () => ({
    dir: []
  }),
  created () {
    this.folder = this.$route.query.folder || null
    this.updateFn()
  },
  computed: {
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

      this.$q.loading.show()
      storage.setApiKey(this.apiKey)
      this.$router.push({ query: { folder: this.folder } })
        .catch(() => {})
      storage.dir.list(this.folder)
        .then(dir => { this.dir = dir })
        .catch(e => this.$Msg(e.message, false))
        .finally(() => this.$q.loading.hide())
    },

    selectFn (dir) {
      if (dir.type === 'folder') return this.addPathToFolderFn(dir.name)
      window.open(dir.href)
    },
    uploadFileFn (files) {
      this.$q.loading.show()

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
          this.$q.loading.show()

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
      this.$q.loading.show()

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

    addPathToFolderFn (path) {
      if (!this.folder) this.folder = path
      else this.folder += '/' + path
    }
  },
  watch: {
    folder () { this.updateFn() },
    apiKey () { this.updateFn() },
    '$route.query.folder' () { this.folder = this.$route.query.folder || null }
  }
}
</script>

<template>
  <div class="earth-storage">

    <div class="options row">
      <earth-file multiple @input="uploadFileFn"/>
      <earth-btn label="Criar Pasta" icon="eva-folder-outline" @click="createFolderFn"/>
    </div>

    <div class="folders">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" :to="{ query: { folder: null } }"/>
        <q-breadcrumbs-el v-for="path in paths" :key="path.label"
          :label="path.label" :to="{ query: { folder: path.folder } }"/>
      </q-breadcrumbs>
    </div>

    <div class="container row" v-if="dir.length">
      <div v-for="d in dir" :key="d.folder + d.name">
        <earth-storage-dir :metadata="d" @click="selectFn(d)"/>
        <q-menu context-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="selectFn(d)">
              <q-item-section avatar>
                <q-icon name="visibility"/>
              </q-item-section>
              <q-item-section>Visualizar</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="downloadFn(d)">
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
