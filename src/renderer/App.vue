<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  // import Vue, { ComponentOptions } from 'vue'
  export default {
    name: 'douban-group-search'
  }
</script>

<style>
  /* CSS */

  @import '~normalize.css';
  /* @import "./style/theme/index.css"; */

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Microsoft Yahei', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Microsoft Yahei', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
