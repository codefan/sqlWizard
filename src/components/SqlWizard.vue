<template>
  <Tabs label="sqlWizard" type="card">
    <TabPane label="查询设计">
      <Tabs type="card">
        <TabPane label="选择字段">选择字段</TabPane>
        <TabPane label="关联管理">关联管理</TabPane>
        <TabPane label="数据过滤">数据过滤</TabPane>
        <TabPane label="分组过滤">分组过滤</TabPane>
        <TabPane label="排序设定">排序设定</TabPane>
        <TabPane label="参数管理">参数管理</TabPane>
      </Tabs>
    </TabPane>
    <TabPane label="示例数据">示例数据</TabPane>
  </Tabs>
</template>

<script>
export default {
  name: 'SqlWizard',
  data () {
    return {
      msg: 'Welcome to my sql wizard Vue.js App'
    }
  }
}
</script>
