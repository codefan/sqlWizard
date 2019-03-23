<template>
  <Table border ref="stepsSelection" :columns="stepCols" :data="stepFields"
         highlight-row
         @on-current-change="onSelectFieldSelectEvent"
  ></Table>
</template>

<script>
export default {
  name: 'DataPackectOpt',
  methods: {},
  data () {
    return {
      dataPacket: {
        packetId: '',
        packetName: '',
        packetType: '',
        packetDesc: '',
        packetParams: [{
          paramName: '',
          paramLabel: '',
          paramType: ''
        }],
        rmdbQueries: [
          {
            queryId: '',
            queryName: '',
            queryDesc: '',
            columns: [
              {
                columnCode: '',
                propertyName: '',
                columnName: '',
                dataType: '',
                isStatData: false
              }
            ]
          }
        ]
      },
      optSteps: [
        {
          operation: 'map',
          source: '',
          target: '',
          map: { /*这是一个 Map值，key为新增的字段名，value为旧的字段名的表达式*/
            extField1: 'field1 + fiedl2'
          }
        },
        {
          operation: 'filter',
          source: '',
          target: '',
          filter:  'field1 + fiedl2 > 5 ' /*一个逻辑表达式*/
        },
        {
          operation: 'append',
          source: '',
          target: '',
          map: { /*这是一个 Map值，key为新增的字段名，value为旧的字段名的表达式*/
            extField1: 'field1 + fiedl2'
          }
        },
        {
          operation: 'stat',
          source: '',
          target: '',
          groupBy:['field1','field2'],
          stat: { /*对字段进行统计分析*/
            extField1: 'field1:sum',
            extField2: 'field2:mean',
          }
        },
        {
          operation: 'analyse',
          source: '',
          target: '',
          groupBy:['field1','field2'],
          orderBy:['field3','field4'],
          analyse: { /*这是一个 Map值，分析函数 :1 表示在同组中向前找，:_1b表示向后找*/
            extField4: '(field4 - fiedl4:1 / field4:1) * 100 + "%"'
          }
        },
        {
          operation: 'cross',
          source: '',
          target: '',
          rowHeader:['field1','field2'],
          colHeader:['field3','field4'],
        },
        {
          operation: 'compare',
          source: '',
          source2: '',
          target: '',
          primaryKey:['field1','field2']
        },
        {
          operation: 'join',
          source: '',
          source2: '',
          target: '',
          primaryKey:['field1','field2']
        },
        { /*会多一个字段 rmdb_dataset_writer_result*/
          operation: 'persistence',
          source: '',
          databaseCode: '',
          tableName: '',
          writerType: 'merge'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>
