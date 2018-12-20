<template>
  <!--<Tabs label="sqlWizard" type="card" style="height: 100vh;">
    <TabPane label="查询设计">-->
    <Tabs type="card" style="height: 100vh;">
      <TabPane label="选择字段">
        <Layout>
          <Sider style="background: #fff;" hide-trigger>
            <div>
              <Tree
                @on-select-change="onTreeItemClick"
                :data="tableFields"></Tree>
            </div>
          </Sider>
          <Layout>
            <Content>
              <Table border ref="selection" :columns="selectCols" :data="selectFields"
                     highlight-row
                     @on-current-change="(selection) => selectedRows = selection"
                     @on-selection-change="(selection) => selectedRows = selection"
              ></Table>
              {{selectedRows}}
            </Content>
            <Footer align="left">
              数据处理: {{currentFieldOpt}}
              <br>
              {{optFuncs}}
              {{statFuncs}}
              <Select style="width:200px" v-model="currentFieldOpt.optType" >
                <!--<OptionGroup label="一般函数">-->
                  <Option v-for="item in optFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                <!--</OptionGroup>-->
                <!--<OptionGroup label="统计函数">-->
                  <!--<Option v-for="item in statFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</OptionGroup>-->
              </Select>
              <br style="margin-bottom:15px;"/>
                  字段语句：
                  <Input v-model="currentFieldOpt.columnFormula" placeholder="字段或者字段表达式" style="width: auto" />
                  别名：
                  <Input v-model="currentFieldOpt.columnName" placeholder="返回数据字段属性名" style="width: auto" />
              <br/>
              字段描述：
              <Input v-model="currentFieldOpt.columnDesc" placeholder="字段名称，一般用于标识字段内容" style="width: auto" />
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
      <TabPane label="关联管理">
        <Layout>
          <Content>
            <Table border :columns="tableCols" :data="selectTables"></Table>
          </Content>
          <Footer align="right">
            表一：
            <Input v-model="joinOpt.leftTable" placeholder="主表" style="width: auto" />
            <Select style="width:200px" v-model="joinOpt.joinType" >
              <Option v-for="item in joinTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            表二：
            <Input v-model="joinOpt.rightTable" placeholder="从表" style="width: auto" />
          </Footer>
        </Layout>
      </TabPane>
      <TabPane label="数据过滤">
        <Layout>
          <Sider style="background: #fff;" hide-trigger>
            <div>
              <Tree
                @on-select-change="onTreeFilterClick"
                :data="tableFields"></Tree>
            </div>
          </Sider>
          <Layout>
            <Content>
              <Table border :columns="filterCols" :data="filterFields"></Table>
            </Content>
            <Footer align="left">
              数据处理:
              <Select style="width:200px" v-model="filterFieldOpt.optType" >
                <OptionGroup label="一般函数">
                  <Option v-for="item in optFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </OptionGroup>
                <OptionGroup label="统计函数">
                  <Option v-for="item in statFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </OptionGroup>
                <OptionGroup label="特殊操作">
                  <Option value="fieldOpt">字段运算</Option>
                </OptionGroup>
              </Select>
              <br style="margin-bottom:15px;"/>
              字段语句：
              <Input v-model="filterFieldOpt.fieldSql" placeholder="字段或者字段表达式" style="width: auto" />
              字段描述：
              <Input v-model="filterFieldOpt.fieldDesc" placeholder="字段描述" style="width: auto" />
              <br/>
              逻辑：
              <Select style="width:200px" v-model="filterFieldOpt.filterLogic" >
                <Option v-for="item in filterLogics" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <br/>
              数值：
              <Input v-model="filterFieldOpt.logicParam" placeholder="参数" style="width: auto" >
                <Select slot="append" style="width: 70px">
                  <Option v-for="item in sqlParams" :value="item.name" :key="item.code">{{ item.label }}</Option>
                </Select>
              </Input>
              <br/>
              数值2(只有 逻辑为between 时才需要显示)：
              <Input v-model="filterFieldOpt.logicParam2" placeholder="参数" style="width: auto" >
                <Select slot="append" style="width: 70px">
                  <Option v-for="item in sqlParams" :value="item.name" :key="item.code">{{ item.label }}</Option>
                </Select>
              </Input>
              <br/>
              <Button :size="Default" type="primary">
                添加
              </Button>
              <Button :size="Default" type="primary">
                修改
              </Button>
              <Button :size="Default" type="primary">
                删除
              </Button>
              <br/>
              逻辑表达式：
              <Input v-model="filterSqlFormula" type="textarea" :rows="2" placeholder="序号表示上面表格中对应的语句，+ 表示或 * 表示并" />
              <br/>
              <Button :size="Default" type="primary">
                并
              </Button>
              <Button :size="Default" type="primary">
                或
              </Button>
              <Button :size="Default" type="primary">
                （
              </Button>
              <Button :size="Default" type="primary">
                ）
              </Button>
              <Button :size="Default" type="primary">
                取反
              </Button>
            </Footer>
          </Layout>
        </Layout>
      </TabPane>
      <TabPane label="分组过滤">
        <Layout>
          <Sider style="background: #fff;" hide-trigger>
            <Table border ref="selection" :columns="haveSelectCols" :data="selectFields"></Table>
          </Sider>
          <Layout>
            <Content>
              <Table border ref="selection" :columns="havingCols" :data="havingFields"></Table>
            </Content>
            <Footer align="left">
              字段语句：
              <Input v-model="havingFieldOpt.fieldSql" placeholder="字段或者字段表达式" style="width: auto" />
              字段描述：
              <Input v-model="havingFieldOpt.fieldDesc" placeholder="字段描述" style="width: auto" />
              <br/>
              逻辑：
              <Select style="width:200px" v-model="havingFieldOpt.filterLogic" >
                <Option v-for="item in filterLogics" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <br/>
              数值：
              <Input v-model="havingFieldOpt.logicParam" placeholder="参数" style="width: auto" >
                <Select slot="append" style="width: 70px">
                  <Option v-for="item in sqlParams" :value="item.name" :key="item.code">{{ item.label }}</Option>
                </Select>
              </Input>
              <br/>
              数值2(只有 逻辑为between 时才需要显示)：
              <Input v-model="havingFieldOpt.logicParam2" placeholder="参数" style="width: auto" >
                <Select slot="append" style="width: 70px">
                  <Option v-for="item in sqlParams" :value="item.name" :key="item.code">{{ item.label }}</Option>
                </Select>
              </Input>
              <br/>
              <Button :size="Default" type="primary">
                添加
              </Button>
              <Button :size="Default" type="primary">
                修改
              </Button>
              <Button :size="Default" type="primary">
                删除
              </Button>
              <br/>
              逻辑表达式：
              <Input v-model="filterSqlFormula" type="textarea" :rows="2" placeholder="序号表示上面表格中对应的语句，+ 表示或 * 表示并" />
              <br/>
              <Button :size="Default" type="primary">
                并
              </Button>
              <Button :size="Default" type="primary">
                或
              </Button>
              <Button :size="Default" type="primary">
                （
              </Button>
              <Button :size="Default" type="primary">
                ）
              </Button>
              <Button :size="Default" type="primary">
                取反
              </Button>
            </Footer>
          </Layout>
        </Layout>
      </TabPane>
      <TabPane label="排序设定">
        <Layout>
          <Sider style="background: #fff;" hide-trigger>
            <Sider style="background: #fff;" hide-trigger>
              <Table border ref="selection" :columns="haveSelectCols" :data="selectFields"></Table>
            </Sider>
          </Sider>
          <Layout>
            <Content>
              <Table border ref="selection" :columns="sortedCols" :data="sortedFields"></Table>
            </Content>
            <Footer align="left">
              排序字段：
              <Input v-model="sortOpt.sortColumnDesc" prefix="ios-contact" placeholder="排序字段" style="width: auto" />
              排序方式：
              <Select style="width:200px" v-model="sortOpt.sortType" >
                <Option value="asc">升序</Option>
                <Option value="desc">降序</Option>
              </Select>
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
      <TabPane label="参数管理">
        <Layout>
          <Content>
            <Table border ref="selection" :columns="paramsCols" :data="sqlParams"></Table>
          </Content>
          <Footer align="right">
            参数描述：
            <Input v-model="paramOpt.paramName" placeholder="参数内容描述" style="width: auto" />
            默认值：
            <Input v-model="paramOpt.defaultValue" placeholder="参数默认值（可以式表达式）" style="width: auto" />
            <Button :size="Default" type="primary">
              添加
            </Button>
            <Button :size="Default" type="primary">
              修改
            </Button>
            <Button :size="Default" type="primary">
              删除
            </Button>
          </Footer>
        </Layout>
      </TabPane>
    </Tabs>
  <!--</TabPane>
    <TabPane label="示例数据">示例数据</TabPane>
  </Tabs>-->
</template>

<script>
export default {
  name: 'SqlWizard',
  methods: {
    onTreeItemClick (selectedItem, clickItem) {
      this.currentFieldOpt.optType = 'none'
      this.currentFieldOpt.columnFormula = clickItem.column
      this.currentFieldOpt.columnName = clickItem.column
      this.currentFieldOpt.columnDesc = clickItem.title
    },
    // 过滤条件树 点击事件
    onTreeFilterClick (selectedItem, clickItem) {
      this.filterFieldOpt.optType = 'none'
      this.filterFieldOpt.fieldSql = clickItem.column
      this.filterFieldOpt.fieldDesc = clickItem.title
    }
  },
  data () {
    return {
      selectedRows: [],
      Default: 'default',
      filterSqlFormula: '',
      sqlSentence: {
        fieldsSql: '',
        fromTableSql: '',
        whereSql: '',
        groupBySql: '',
        havingSql: '',
        orderBySql: ''
      },
      currentFieldOpt: {
        optType: 'none',
        columnFormula: '',
        columnName: '',
        columnDesc: ''
      },
      sortOpt: {
        sortColumn: '',
        sortColumnDesc: '',
        sortType: 'asc'
      },
      joinOpt: {
        leftTable: '',
        joinType: 'join',
        rightTable: ''
      },
      filterFieldOpt: {
        optType: 'none',
        fieldSql: '',
        fieldDesc: '',
        filterLogic: '',
        logicParam: '',
        logicParam2: ''
      },
      havingFieldOpt: {
        fieldSql: '',
        fieldDesc: '',
        filterLogic: '',
        logicParam: '',
        logicParam2: ''
      },
      paramOpt: {
        paramName: '',
        paramCode: '',
        defaultValue: ''
      },
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
      haveSelectCols: [
        {
          title: '字段描述',
          key: 'columnDesc'
        },
        {
          title: 'SQL语句',
          key: 'columnSql'
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
          colFormula: 'T.user_name',
          columnName: 'user_name',
          columnDesc: '用户姓名',
          columnSql: 'T.user_name',
          isStat: false
        },
        {
          colFormula: 'T1.edu_record',
          columnName: 'edu_record',
          columnDesc: '学历',
          columnSql: 'T1.edu_record',
          isStat: false
        },
        {
          colFormula: 'T1.edu_school',
          columnName: 'edu_school',
          columnDesc: '学校',
          columnSql: 'T1.edu_school',
          isStat: true
        },
        {
          colFormula: 'T2.work_unit',
          columnName: 'work_unit',
          columnDesc: '工作单位',
          columnSql: 'T2.work_unit',
          isStat: true
        }
      ],
      optFuncs: [
        {
          label: '无操作',
          value: 'none'
        },
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
      ],
      tableCols: [
        {
          title: '主表名（表一）',
          key: 'leftTable'
        },
        {
          title: '链接方式',
          key: 'joinType'
        },
        {
          title: '从表名（表二）',
          key: 'rightTable'
        }
      ],
      selectTables: [
        {
          leftTable: '',
          joinType: '',
          rightTable: '用户信息表',
          leftTableCode: '',
          joinTypeSql: '',
          rightTableCode: 'USER_INFO T'
        },
        {
          leftTable: '用户信息表',
          joinType: '内链接',
          rightTable: '用户工作表',
          leftTableCode: 'USER_INFO T',
          joinTypeSql: 'join',
          rightTableCode: 'user_career T1'
        }
      ],
      joinTypes: [
        {
          label: '内联接',
          value: 'join'
        },
        {
          label: '左联接',
          value: 'left join'
        },
        {
          label: '右联接',
          value: 'right join'
        },
        {
          label: '全链接',
          value: 'full outer join'
        }
      ],
      filterCols: [
        {
          title: '序号',
          key: 'filterNo'
        },
        {
          title: '字段代码',
          key: 'filterColumn'
        },
        {
          title: '逻辑',
          key: 'filterLogic'
        },
        {
          title: '数值',
          key: 'filterValue'
        },
        {
          title: '逻辑表达式',
          key: 'filterSql'
        },
        {
          title: '过滤说明',
          key: 'filterDesc'
        }
      ],
      filterFields: [
        {
          filterNo: '1',
          filterColumn: 'user_name',
          filterLogic: '等于',
          filterValue: '张三',
          filterSql: 'T.user_name ="张三"',
          filterDesc: '用户姓名 = 张三'
        }
      ],
      filterLogics: [
        {
          label: '等于',
          value: '=',
          params: 1
        },
        {
          label: '小于',
          value: '<',
          params: 1
        },
        {
          label: '大于',
          value: '>',
          params: 1
        },
        {
          label: '小于等于',
          value: '<=',
          params: 1
        },
        {
          label: '大于等于',
          value: '>=',
          params: 1
        },
        {
          label: '不等于',
          value: '<>',
          params: 1
        },
        {
          label: '介于',
          value: 'between',
          params: 2
        },
        {
          label: '包含于',
          value: 'in (',
          params: 1
        },
        {
          label: '像',
          value: 'like',
          params: 1
        },
        {
          label: '开头',
          value: 'startwith',
          params: 1
        },
        {
          label: '空值',
          value: 'is null',
          params: 0
        },
        {
          label: '非空',
          value: 'is not null',
          params: 0
        },
        {
          label: '标记值',
          value: 'note',
          params: 0
        }
      ],
      havingCols: [
        {
          title: '序号',
          key: 'filterNo'
        },
        {
          title: '代码',
          key: 'filterColumn'
        },
        {
          title: '逻辑',
          key: 'filterLogic'
        },
        {
          title: '数值',
          key: 'filterValue'
        },
        {
          title: '逻辑表达式',
          key: 'filterSql'
        },
        {
          title: '过滤说明',
          key: 'filterDesc'
        }
      ],
      havingFields: [
        {
          filterNo: '1',
          filterColumn: 'sum(T.user_salary)',
          filterLogic: '大于',
          filterValue: '120000',
          filterSql: 'sum(T.user_salary) > 120000',
          filterDesc: '薪资 求和 大于 120000'
        }
      ],
      sortedCols: [
        {
          title: '字段描述',
          key: 'columnDesc'
        },
        {
          title: 'SQL语句',
          key: 'columnSql'
        },
        {
          title: '排序方式',
          key: 'sortType'
        }
      ],
      sortedFields: [
        {
          columnDesc: '用户姓名',
          columnSql: 'T.user_name asc',
          sortType: '升序'
        }
      ],
      paramsCols: [
        {
          title: '参数描述',
          key: 'name'
        },
        {
          title: '默认值',
          key: 'defaultValue'
        }
      ],
      sqlParams: [
        {
          name: '参数',
          code: 'PRM_NO0',
          defaultValue: '100'
        }
      ]
    } // end of return
  }
}
</script>
