<template lang="pug">
  div
    div(style="padding-bottom: 10px; display: flex;")
      Input(v-if="showFilterInput" v-model="filterStr" @on-change="filterStrChange" suffix="ios-search" :placeholder="placeholder" style="position: left; width: auto" clearable)
      div(style="position: absolute; left: 43%; line-height: 30px; display:inherit" v-if="showName")
        slot(class="table-header", name="title")
          span(class="table-header") {{tableName}}
        slot(name="remark")
    Table(border, :row-key="rowKey" :load-data="handleLoadData" :columns="columns", :data="tableDataShow",  :loading="loading", ref="table", @on-selection-change="getSelect" @on-sort-change="sortMethod" size="small" :stripe="stripe")
    div(style="height: 50px; padding-top: 10px")
      Page(style="color: black; float: right;", :total="pageNum",
        :page-size="pageSize", @on-change="handleCpxChange", show-elevator, show-total, show-sizer,
        :current='cpx', @on-page-size-change="handlePageSize", :page-size-opts='[10, 20, 30, 40, 50, 100, 500, 1000, 5000]')
</template>

<script>
import 'view-design/dist/styles/iview.css'
import {Input, Table, Page} from 'view-design'
export default {
  name: 'TablePage',
  components: {
    Input,
    Table,
    Page
  },
  props: {
    tableData: Array,
    columns: Array,
    tableName: String,
    showName: {
      default: false,
      type: Boolean
    },
    rowKey: {
      default: '',
      type: String
    },
    loading: {
      default: false,
      type: Boolean
    },
    fatherPageSize: {
      default: 10,
      type: Number
    },
    fatherCpx: {
      default: 1,
      type: Number
    },
    showFilterInput: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: '搜索表格的数据',
      type: String
    },
    fatherFilterStr: String,
    filterColumnArr: Array,
    stripe: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      pageNum: 0,
      sortKey: '',
      sortOrder: '',
      pageSize: 10,
      cpx: 1,
      filterStr: ''
    }
  },
  mounted () {
    if (this.fatherCpx !== null && this.fatherCpx !== undefined) {
      this.cpx = parseInt(this.fatherCpx)
    }
    if (this.fatherPageSize !== null && this.fatherPageSize !== undefined) {
      this.pageSize = parseInt(this.fatherPageSize)
    }
    if (this.fatherFilterStr !== null && this.fatherFilterStr !== undefined) {
      this.filterStr = this.fatherFilterStr
    }
  },
  computed: {
    tableDataShow () {
      let start = (this.cpx - 1) * this.pageSize
      let end = start + this.pageSize
      let tmp = this.tableDataLimit.slice(start, end)
      return tmp
    },
    tableDataLimit () {
      if (this.tableData === null || this.tableData === undefined || this.tableData.length === 0) {
        return []
      }
      if (this.filterStr === null || this.filterStr === undefined || this.filterStr === '') {
        return this.tableData
      } else {
        let tmp = []
        if (this.filterColumnArr !== null && this.filterColumnArr !== undefined && this.filterColumnArr.length > 0) {
          tmp = this.filterColumnArr
        } else {
          tmp = Object.keys(this.tableData[0])
        }
        return this.filterTableData(this.tableData, this.filterStr, tmp)
      }
    }
  },
  watch: {
    fatherCpx (newVal) {
      this.cpx = newVal
    },
    fatherPageSize (newVal) {
      this.pageSize = newVal
    },
    tableDataLimit (newVal) {
      if (newVal === undefined || newVal === null || newVal.length === 0) {
        this.pageNum = 0
        this.handleCpxChange(1)
        return []
      }
      this.pageNum = newVal.length
      let tmpCpx = this.cpx
      while (this.pageSize * (tmpCpx - 1) >= this.pageNum) {
        tmpCpx -= 1
      }
      if (this.cpx !== tmpCpx) {
        this.handleCpxChange(tmpCpx)
      }
    }
  },
  methods: {
    filterStrChange (val) {
      this.$emit('filterStrChange', val.target.value)
    },
    sortMethod (param) {
      this.sortKey = param.key
      this.sortOrder = param.order
      this.tableData.sort(this.compare)
      this.handleCpxChange(1)
    },

    compare (obj1, obj2) {
      let key = this.sortKey
      var val1 = obj1[key]
      var val2 = obj2[key]
      if (val1 < val2) {
        if (this.sortOrder === 'asc') { return -1 } else { return 1 }
      } else if (val1 > val2) {
        if (this.sortOrder === 'asc') { return 1 } else { return -1 }
      } else {
        return 0
      }
    },

    exportData () {
      this.$refs.table.exportCsv({
        filename: this.$cookies.get('mispic') + '-' + moment().format('YYYY-MM-DD')
      })
    },

    getSelect (selection) {
      this.$emit('selectIds', selection)
    },

    handleCpxChange (value) {
      this.cpx = value
      this.$emit('pageChange', this.pageSize, value)
    },

    handlePageSize (value) {
      this.cpx = 1
      this.pageSize = value
      this.$emit('pageChange', value, 1)
    },
    handleLoadData (item, callback) {
      this.$emit('handleLoadData', item, callback)
    },
    filterTableData (tableData, filterStr, columnArr) {
      let result = []
      let filter = ''
      if (filterStr !== null && filterStr !== undefined) {
        filter = filterStr.trim().toLowerCase()
      }
      for (let it of tableData) {
        let flag = false
        for (let column of columnArr) {
          if (String(it[column]).toLowerCase().indexOf(filter) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          result.push(it)
        }
      }
      return result
    }
  }
}
</script>
<style>
.table-header {
  font-weight:bold;
  font-size: 16px;
  color: #464c5b
}
</style>
