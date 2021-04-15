import EarthStorage from './src/components/EarthStorage'
import EarthStorageSelect from './src/components/select'

class EarthStorageInstall {
  static install (Vue, options = {}) {
    Vue.component('EarthStorage', EarthStorage)
    Vue.component('EarthStorageSelect', EarthStorageSelect)
  }
}

export default EarthStorageInstall
export { EarthStorage, EarthStorageSelect }
