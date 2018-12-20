<template>
  <Tabs label="sqlWizard" type="card">
    <TabPane label="查询设计">
      <Tabs type="card">
        <TabPane label="选择字段">
          <Layout>
            <Sider hide-trigger>
              <div>
                <Tree :data="tableFields"></Tree>
              </div>
            </Sider>
            <Layout>
              <Content>
                <Table border ref="selection" :columns="selectCols" :data="selectFields"></Table>
              </Content>
              <Footer >
                数据处理函数
                <Select style="width:200px">
                  <OptionGroup label="一般函数">
                    <Option v-for="item in optFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </OptionGroup>
                  <OptionGroup label="统计函数">
                    <Option v-for="item in statFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </OptionGroup>
                </Select>
                <br/>
                    字段语句：
                    <Input prefix="ios-contact" placeholder="字段或者字段表达式" style="width: auto" />
                    别名：
                    <Input suffix="ios-search" placeholder="返回数据字段属性名" style="width: auto" />
                <br/>
                字段描述：
                <Input prefix="ios-contact" placeholder="字段名称，一般用于标识字段内容" style="width: auto" />
                <br/>
                <ButtonGroup :size="Default">
                  <Button :size="Default" type="primary">
                    <Icon type="ios-arrow-back" />
                    上移
                  </Button>
                  <Button :size="Default" type="primary">
                    下移
                    <Icon type="ios-arrow-forward" />
                  </Button>
                </ButtonGroup>
                <ButtonGroup :size="Default">
                  <Button :size="Default" type="primary">
                    添加
                  </Button>
                  <Button :size="Default" type="primary">
                    修改
                  </Button>
                  <Button :size="Default" type="primary">
                    删除
                  </Button>
                </ButtonGroup>
              </Footer>
            </Layout>
          </Layout>
        </TabPane>
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
      tableFields: [
        {
          title: '主键',
          column: 'id'
        }, {
          title: '用户代码',
          column: 'user_code'
        }, {
          title: '用户姓名',
          column: 'user_name'
        }, {
          title: '用户电话',
          column: 'user_phone'
        }, {
          title: '教育经历',
          table: 'user_educations',
          expand: true,
          children: [
            {
              title: '主键',
              column: 'id'
            },
            {
              title: '学历',
              column: 'edu_record'
            },
            {
              title: '学校',
              column: 'edu_school'
            },
            {
              title: '入学时间',
              column: 'begin_date'
            },
            {
              title: '毕业时间',
              column: 'end_date'
            }
          ]
        }, {
          title: '工作经历',
          table: 'user_career',
          expand: true,
          children: [
            {
              title: '主键',
              column: 'id'
            },
            {
              title: '单位',
              column: 'work_unit'
            },
            {
              title: '工作内容',
              column: 'work_content'
            },
            {
              title: '入学时间',
              column: 'begin_date'
            },
            {
              title: '毕业时间',
              column: 'end_date'
            }
          ]
        }
      ],
      selectCols: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '字段表达式',
          key: 'colFormula'
        },
        {
          title: '字段别名',
          key: 'columnName'
        },
        {
          title: '字段描述',
          key: 'columnDesc'
        },
        {
          title: 'SQL语句',
          key: 'columnSql'
        }
      ],
      selectFields: [
        {
          colFormula: 'user_name',
          columnName: 'user_name',
          columnDesc: '用户姓名',
          columnSql: 'T.user_name'
        },
        {
          colFormula: 'edu_record',
          columnName: 'edu_record',
          columnDesc: '学历',
          columnSql: 'T1.edu_record'
        },
        {
          colFormula: 'edu_school',
          columnName: 'edu_school',
          columnDesc: '学校',
          columnSql: 'T1.edu_school'
        },
        {
          colFormula: 'work_unit',
          columnName: 'work_unit',
          columnDesc: '工作单位',
          columnSql: 'T2.work_unit'
        }
      ],
      optFuncs: [
        {
          label: '大写',
          value: 'upperCase'
        },
        {
          label: '小写',
          value: 'lowerCase'
        },
        {
          label: '取整',
          value: 'int'
        },
        {
          label: '字段运算',
          value: 'colOpt'
        }
      ],
      statFuncs: [
        {
          label: '求和',
          value: 'sum'
        },
        {
          label: '计数',
          value: 'count'
        },
        {
          label: '平均',
          value: 'avg'
        }
      ]
    } // end of return
  }
}
</script>
