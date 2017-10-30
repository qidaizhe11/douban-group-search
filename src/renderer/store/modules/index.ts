/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

 interface ModulesMap {
   [key: string]: any
 }

const files = require.context('.', false, /\.js$/)
const modules: ModulesMap = {}

files.keys().forEach((key: string) => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
