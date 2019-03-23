<template>
  <Table border ref="stepsSelection" :columns="stepCols" :data="stepFields"
         highlight-row
         @on-current-change="onSelectFieldSelectEvent"
  ></Table>
</template>

<script>
export default {
  name: 'DataPackectOpt',
  methods: {
    findDataSet(packet, dataSetName){
      let selD = packet.rmdbQueries.filter(a => a.queryName === dataSetName)
      return selD.length > 0 ? selD[0] : null
    },

    appendDataSetField(dataSet, fieldNames){
      fieldNames.forEach(f => {
        let selF = dataSet.columns.filter(a => a.propertyName === f.key)
        if(selF < 0){
          dataSet.columns.push({
            columnCode: a.key,
            propertyName: a.key,
            columnName: a.key,
            dataType: 'String',
            isStatData: false
          })
        }
      })
    },

    createDataSet(dataSetName, dataDesc,  fieldNames){
      let dataSet = {
        queryName: dataSetName,
        queryDesc: dataDesc,
        columns: []
      }
      fieldNames.forEach(a => dataSet.columns.push({
        columnCode: a.key,
        propertyName: a.key,
        columnName: a.key,
        dataType: 'String',
        isStatData: false
      }))
      return dateSet;
    },

    updateDataSet(packet, dataSet){
      let i = packet.rmdbQueries.findIndex(a => a.queryName === dataSetName)
      if(i<0){
        packet.rmdbQueries.push(dataSet)
      } else {
        packet.rmdbQueries.splice(i,1,dataSet)
      }
    },

    doPacketOpt(packet, steps){
      steps.forEach(step => {
        switch (step.operation) {
          case 'map':
          case 'stat':
          case 'analyse':
            dataSet = this.createDataSet(step.target, step.source + ':map', step.fieldsMap)
            this.updateDataSet(packet, dataSet)
            break;
          case 'append':
            let dataSet = this.findDataSet(packet, step.source)
            if(dataSet){
              this.appendDataSetField(dataSet, step.map)
            }
            break;
        }
      })
      return packet;
    }
  },
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
          fieldsMap: { /*这是一个 Map值，key为新增的字段名，value为旧的字段名的表达式*/
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
          fieldsMap: { /*这是一个 Map值，key为新增的字段名，value为旧的字段名的表达式*/
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
          fieldsMap: { /*这是一个 Map值，分析函数 :1 表示在同组中向前找，:_1b表示向后找*/
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
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
