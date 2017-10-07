<template>
  <div class="page-container">
    <div class="filter-container">

    </div>
    <div class="tooltip-container">
    </div>
    <div class="table-container">
    </div>
    <div class="pagination-container">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        params: {
          type: 'group',
          title: 'https://www.douban.com/group/mini150cm/',
          sex: 'female',
          city: '郑州'
        },
        tableData: []
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
