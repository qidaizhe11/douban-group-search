<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  // import router from 'router'

  export default Vue.extend({
    name: 'douban-group-search'
  })
</script>

<style lang="scss">
  /* CSS */

  @import '~normalize.css';
  @import "./style/element-variables.scss";

  $font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Microsoft Yahei', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: $font-family;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  body {
    /* font: normal 1em/1.5em 'microsoft Yahei', Verdana, Arial, Helvetica, sans-serif; */
    font-family: $font-family;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
