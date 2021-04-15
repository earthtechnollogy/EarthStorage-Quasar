<script>
import Dir from '../../domain/dir'

export default {
  name: 'EarthStorageDir',
  props: ['metadata', 'selected'],
  props: {
    metadata: { Type: Dir, required: true },
    selected: { Type: Boolean, default: false }
  },
  computed: {
    type () {
      const type = this.metadata.type
      if (type === 'folder') return 'folder'
      if (type.includes('image')) return 'image'
      return 'file'
    },
    icon () {
      if (this.image) return null
      return this.type === 'folder' ? 'ion-folder-open' : 'eva-file-text'
    },
    image () { return this.type === 'image' ? this.metadata.href : null }
  },
  methods: {
    formatNameFn (name) {
      if (name.length <= 30) return name
      return name.substring(0, 13) + '...' + name.substring(name.length - 13, name.length)
    },
    convertBytesFn (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (!bytes) return 'n/a'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      if (i === 0) return bytes + ' ' + sizes[i]
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
    },
    clickFn () { this.$emit('click') },
    rightClickFn () { this.$emit('right-click') }
  }
}
</script>

<template>
  <div class="earth-storage-dir">
    <div class="container column" @click="clickFn" @contextmenu.prevent="rightClickFn">
      <div class="visualization row flex-center col" :style="image ? `background-image: url(${image})` : ''">
        <q-icon :name="icon " v-if="icon"/>
      </div>
      <div class="info">
        <span class="name">{{formatNameFn(metadata.name)}}</span>
        <span class="size">Tamanho: {{convertBytesFn(metadata.size)}}</span>
      </div>
      <div class="selected row flex-center shadow-12" v-if="selected">
        <q-icon name="ion-checkmark"/>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  .earth-storage-dir
    width 250px
    height 250px
    padding 1rem
    .container
      width 100%
      height 100%
      cursor pointer
      overflow hidden
      position relative
      border-radius 1rem
      border 1px solid $grey-5
      .visualization
        background-size cover
        background-position center
        border-bottom 1px solid $grey-5
        .q-icon
          color $primary
          font-size 5rem
      .info
        padding 1rem
        font-size 1.3rem
        span
          width 100%
          display block
        .size
          color $grey-6
      .selected
        top 0
        right 0
        width 30px
        margin 5px
        height 30px
        position absolute
        border-radius 100%
        background-color var(--bg-dark)
        .q-icon
          font-size 2rem
</style>
