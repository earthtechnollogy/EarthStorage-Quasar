import EarthStorage from './src/components/EarthStorage'
import EarthStorageSelect from './src/components/EarthStorageSelect'

export default class EarthStorageInstall {
  static install (Vue, options = {}) {
    Vue.component('EarthStorage', EarthStorage)
    Vue.component('EarthStorageSelect', EarthStorageSelect)
  }
}

export { EarthStorage, EarthStorageSelect }
