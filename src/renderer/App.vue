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

  @import "~normalize.css";
  /* @import "./style/theme/index.css"; */

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  body {
    font: normal 1em/1.5em 'microsoft Yahei', Verdana, Arial, Helvetica, sans-serif;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
