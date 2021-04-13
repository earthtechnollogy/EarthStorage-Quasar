# EarthStorage Quasar

## Table of Contents

 * [Overview](#overview)
 * [Installation](#installation)
 * [Documentation](#documentation)
 * [License](#license)

## Overview

[EarthStorage](https://console.cloud.earthtechnollogy.com) provides the tools and infrastructure for storing and integrating files into your projects. The EarthStorage for Quasar package uses the [EarthStorage SDK Node.js](https://github.com/earthtechnollogy/EarthStorage-SDK-Node) allowing access to EarthStorage services in quasar projects. Provides the components to be called only, either for window mode as a complete storage for uploading and downloading files and in modal format for selector.

## Installation

```bash
npm install @earthtechnollogy/earthstorage-quasar --save
```

```bash
yarn add @earthtechnollogy/earthstorage-quasar
```

Now, if you wanted the components globally, just import:

```js
import Vue from 'vue'
import EarthStorageInstall from '@earthtechnollogy/earthstorage-quasar'

Vue.use(EarthStorageInstall)
```

or if you want to import manually:

```js
import { EarthStorage, EarthStorageSelect } from '@earthtechnollogy/earthstorage-quasar'

...
```

## Documentation

First step is to set the private API Key for the project you want. Remembering that the API Keys for each project can be found on the [EarthCloud Console](https://console.cloud.earthtechnollogy.com).

```html
<earth-storage api-key="x-api-key"/>
```

or you can use the modal version as select:

```html
<earth-storage-select v-model="file" api-key="x-api-key"/>
```

Now just start using it.

## License

EarthStorage Quasar is licensed under the MIT.
