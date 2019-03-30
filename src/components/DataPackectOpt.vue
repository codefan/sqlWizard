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
      let selD = packet.dataSets.filter(a => a.dataSetName === dataSetName)
      return selD.length > 0 ? selD[0] : null
    },
    compareTwoDataSet(dataSet, dataSet2, pks){
      dataSet = JSON.parse(JSON.stringify(dataSet))
      dataSet.columns.forEach(a => {
        if( pks.indexOf(a.columnName)<0){
          a.columnName = a.columnName+":curr"
        }
      })
      dataSet2.columns.forEach(f => {
        if( pks.indexOf(f.columnName)<0){
          dataSet.columns.push({
            columnCode: f.columnCode,
            columnName: f.columnName + ":next",
            dataType: f.dataType,
            isStatData: f.isStatData
          })
        }
      })
    },
    joinTwoDataSet(dataSet, dataSet2){
      dataSet = JSON.parse(JSON.stringify(dataSet))
      dataSet2.columns.forEach(f => {
        let selF = dataSet.columns.filter(a => a.columnName === f.columnName)
        if(selF < 0){
          dataSet.columns.push({
            columnCode: f.columnCode,
            columnName: f.columnName,
            dataType: f.dataType,
            isStatData: f.isStatData
          })
        }
      })
    },
    appendDataSetField(dataSet, fieldNames){
      fieldNames.forEach(f => {
        let selF = dataSet.columns.filter(a => a.columnName === f.key)
        if(selF < 0){
          dataSet.columns.push({
            columnCode: a.key,
            columnName: a.key,
            dataType: 'String',
            isStatData: false
          })
        }
      })
    },
    createDataSet(dataSetName, dataDesc, fieldNames){
      let dataSet = {
        dataSetName: dataSetName,
        dataSetTitle: dataDesc,
        columns: []
      }
      fieldNames.forEach(a => dataSet.columns.push({
        columnCode: a.key,
        columnName: a.key,
        dataType: 'String',
        isStatData: false
      }))
      return dateSet;
    },

    updateDataSet(packet, dataSet){
      let i = packet.dataSets.findIndex(a => a.dataSetName === dataSet.dataSetName)
      if(i<0){
        packet.dataSets.push(dataSet)
      } else {
        packet.dataSets.splice(i,1,dataSet)
      }
    },

    doPacketOpt(packet, steps){
      steps.forEach(step => {
        let dataSet, dataSet2
        switch (step.operation) {
          case 'map':
            dataSet = this.createDataSet(step.target, step.source + ':map', step.fieldsMap)
            this.updateDataSet(packet, dataSet)
            break;
          case 'stat':
          case 'analyse':
            dataSet = this.createDataSet(step.target, step.source + ':'+step.operation, step.fieldsMap)
            step.groupBy.forEach(rowH => dataSet.columns.push({
              columnCode: rowH,
              columnName:rowH,
              dataType: 'String',
              isStatData: false
            }))
            this.updateDataSet(packet, dataSet)
            break;
          case 'append':
            dataSet = this.findDataSet(packet, step.source)
            if(dataSet){
              this.appendDataSetField(dataSet, step.fieldsMap)
            }
            break;
          case 'join':
          case 'union':
            dataSet = this.findDataSet(packet, step.source)
            dataSet2 = this.findDataSet(packet, step.source2)
            if(dataSet && dataSet2){
              this.joinTwoDataSet(dataSet, dataSet2)
              dataSet.dataSetName = step.target
              dataSet.dataSetTitle = step.source+':'+ step.operation
              this.updateDataSet(packet, dataSet)
            }
            break;
          case 'cross':
            dataSet = {
              dataSetName: step.target,
              dataSetTitle: step.source+":cross",
              columns: []
            }
            step.rowHeader.forEach(rowH => dataSet.columns.push({
              columnCode: rowH,
              columnName:rowH,
              dataType: 'String',
              isStatData: false
            }))
            let colField = step.colHeader.join(':*:')
            dataSet.columns.push({
              columnCode: colField,
              columnName:colField,
              dataType: 'Number',
              isStatData: true
            })

            dataSet.dataSetName = step.target
            dataSet.dataSetTitle = step.source+":cross",
            this.updateDataSet(packet, dataSet)
            break;
          case 'compare':
            dataSet = this.findDataSet(packet, step.source)
            dataSet2 = this.findDataSet(packet, step.source2)
            let pks = step.primaryKey
            if(dataSet && dataSet2){
              this.compareTwoDataSet(dataSet, dataSet2, pks)
              dataSet.dataSetName = step.target
              dataSet.dataSetTitle = step.source+":compare"
              this.updateDataSet(packet, dataSet)
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
        dataSets: [
          {
            dataSetId: '',
            dataSetName: '',
            dataSetTitle: '',
            columns: [
              {
                columnCode: '',
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
          fieldsMap: { /*对字段进行统计分析*/
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
        {
          operation: 'union',
          source: '',
          source2: '',
          target: '',
        },
        {
          operation: 'static',
          target: '',
          data:[{},{}]
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
