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
              <Table border ref="fieldSelection" :columns="selectCols" :data="selectFields"
                     highlight-row
                     @on-current-change="onSelectFieldSelectEvent"
              ></Table>
            </Content>
            <Footer align="left">
              数据处理:
              <br>
              <Select style="width:200px" :label-in-value="true" v-model="currentFieldOpt.optType" @on-change="onCurrFieldFuncChangeEvent" >
                <Option v-for="item in optFuncs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                <Option value="colOpt" key="colOpt">字段运算</Option>
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
              <ButtonGroup :size="buttonSize">
                <Button :size="buttonSize" type="primary" @click="moveSelectFieldUpEvent">
                  <Icon type="ios-arrow-back" />
                  上移
                </Button>
                <Button :size="buttonSize" type="primary" @click="moveSelectFieldDownEvent">
                  下移
                  <Icon type="ios-arrow-forward" />
                </Button>
              </ButtonGroup>
              <ButtonGroup :size="buttonSize">
                <Button :size="buttonSize" type="primary" @click="addSelectFieldEvent">
                  添加
                </Button>
                <Button :size="buttonSize" type="primary" @click="updateSelectFieldEvent">
                  修改
                </Button>
                <Button :size="buttonSize" type="primary" @click="deleteSelectFieldEvent">
                  删除
                </Button>
              </ButtonGroup>
            </Footer>
          </Layout>
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
              <Table border :columns="filterCols" :data="filterFields"
                     highlight-row
                     @on-current-change="(item) => this.currFilterRow = item"
              ></Table>
            </Content>
            <Footer align="left">
              数据处理:
              <Select style="width:200px" v-model="filterFieldOpt.optType" :label-in-value="true"  @on-change="onFilterFieldFuncChangeEvent">
                <Option v-for="item in optFuncs" v-if="! item.isStat" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <br style="margin-bottom:15px;"/>
              字段语句：
              <Input v-model="filterFieldOpt.fieldSql" placeholder="字段或者字段表达式" style="width: auto" />
              字段描述：
              <Input v-model="filterFieldOpt.fieldDesc" placeholder="字段描述" style="width: auto" />
              <br/>
              逻辑：
              <Select style="width:200px" v-model="filterFieldOpt.filterLogic" :label-in-value="true"  @on-change="onFilterFieldLogicChangeEvent">
                <Option v-for="item in filterLogics" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <br/>
              <div v-show="logicParamShow">
                {{filterFieldOpt.filterLogic}}：
                <Input v-model="filterFieldOpt.logicParam" placeholder="参数" style="width: auto" />
                  <Select v-model="filterFieldOpt.logicParamSel" style="width: 70px" :label-in-value="true" @on-change="onFilterParamChangeEvent"> <!--slot="append"-->
                    <Option v-for="item in sqlParams" :value="item.code" :key="item.code">{{ item.name }}</Option>
                  </Select>
                <!--</Input>-->
              </div>

              <div v-show="logicParam2Show">
                and：
                <Input v-model="filterFieldOpt.logicParam2" placeholder="参数2" style="width: auto" />
                <Select v-model="filterFieldOpt.logicParam2Sel" style="width: 70px" :label-in-value="true" @on-change="onFilterParam2ChangeEvent"> <!--slot="append"-->
                  <Option v-for="item in sqlParams" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
                <!-- </Input>-->
              </div>

              <Button :size="buttonSize" type="primary" @click="addFilterSqlEvent">
                添加
              </Button>
              <Button :size="buttonSize" type="primary" @click="updateFilterSqlEvent">
                修改
              </Button>
              <Button :size="buttonSize" type="primary" @click="deleteFilterSqlEvent">
                删除
              </Button>
              <br/>
              逻辑表达式，序号待办上面列表中的条件,如果不在范围内表已删除的条件，需要移除;’*‘表示and'+'表示or，还可以使用'('和')'：
              <Input v-model="filterSqlFormula" type="textarea" :rows="2" placeholder="序号表示上面表格中对应的语句，+ 表示或 * 表示并" />
              <!--<br/>
              <Button :size="buttonSize" type="primary">
                并
              </Button>
              <Button :size="buttonSize" type="primary">
                或
              </Button>
              <Button :size="buttonSize" type="primary">
                （
              </Button>
              <Button :size="buttonSize" type="primary">
                ）
              </Button>
              <Button :size="buttonSize" type="primary">
                取反
              </Button>-->
            </Footer>
          </Layout>
        </Layout>
      </TabPane>
      <TabPane label="关联管理">
        <Layout>
          <Content>
            <Table border :columns="tableCols" :data="selectTables"
                   highlight-row
                   @on-current-change="(item) => this.joinOpt = item"
            ></Table>
          </Content>
          <Footer align="right">
            表一：
            <Input v-model="joinOpt.leftTable" placeholder="主表" style="width: auto" />
            <Select style="width:200px" v-model="joinOpt.joinTypeSql" :label-in-value="true" @on-change="onJoinTypeChangeEvent">
              <Option v-for="item in joinTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            表二：
            <Input v-model="joinOpt.rightTable" placeholder="从表" style="width: auto" />
          </Footer>
        </Layout>
      </TabPane>
      <TabPane label="分组过滤" :disabled="groupPaneDisable">
        <Layout>
          <Sider style="background: #fff;" hide-trigger>
            <Table border :columns="haveSelectCols" :data="selectFields.filter(n => n.isStat)"></Table>
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
              <Input v-model="havingFieldOpt.logicParam" placeholder="参数" style="width: auto" />
                <Select style="width: 70px"> <!--slot="append"-->
                  <Option v-for="item in sqlParams" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
             <!-- </Input>-->
              <br/>
              数值2(只有 逻辑为between 时才需要显示)：
              <Input v-model="havingFieldOpt.logicParam2" placeholder="参数" style="width: auto" />
                <Select style="width: 70px"> <!--slot="append"-->
                  <Option v-for="item in sqlParams" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
              <!--</Input>-->
              <br/>
              <Button :size="buttonSize" type="primary">
                添加
              </Button>
              <Button :size="buttonSize" type="primary">
                修改
              </Button>
              <Button :size="buttonSize" type="primary">
                删除
              </Button>
              <br/>
              逻辑表达式：
              <Input v-model="filterSqlFormula" type="textarea" :rows="2" placeholder="序号表示上面表格中对应的语句，+ 表示或 * 表示并" />
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
              <ButtonGroup :size="buttonSize">
                <Button :size="buttonSize" type="primary">
                  <Icon type="ios-arrow-back" />
                  上移
                </Button>
                <Button :size="buttonSize" type="primary">
                  下移
                  <Icon type="ios-arrow-forward" />
                </Button>
              </ButtonGroup>
              <ButtonGroup :size="buttonSize">
                <Button :size="buttonSize" type="primary">
                  添加
                </Button>
                <Button :size="buttonSize" type="primary">
                  修改
                </Button>
                <Button :size="buttonSize" type="primary">
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
            <Button :size="buttonSize" type="primary">
              添加
            </Button>
            <Button :size="buttonSize" type="primary">
              修改
            </Button>
            <Button :size="buttonSize" type="primary">
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
      if (clickItem.column) {
        this.currentFieldOpt.optType = 'none'
        this.currentFieldOpt.columnFormula = clickItem.tableAlias + '.' + clickItem.column
        this.currentFieldOpt.columnName = clickItem.column
        this.currentFieldOpt.columnDesc = clickItem.title
        this.currentFieldOpt.rawValue = clickItem.tableAlias + '.' + clickItem.column
        this.currentFieldOpt.rawDesc = clickItem.title
        this.currentFieldOpt.tableAlias = clickItem.tableAlias
        this.currentFieldOpt.isStat = false
      }
    },
    onCurrFieldFuncChangeEvent (item) {
      // 需要一个标注输据库类型全局变量，根据不同的数据库拼接不同的函数
      // this.currentFieldOpt.optType = item.value
      if (this.currentFieldOpt.rawValue === '') {
        return
      }
      this.currentFieldOpt.columnFormula = item.value + '(' + this.currentFieldOpt.rawValue + ')'
      this.currentFieldOpt.columnDesc = '对 ' + this.currentFieldOpt.rawDesc + ' ' + item.label
      this.currentFieldOpt.isStat = false

      this.optFuncs.forEach(fun => {
        if (item.value === fun.value) {
          this.currentFieldOpt.isStat = fun.isStat
          return false
        }
      })
    },
    onSelectFieldSelectEvent (item) {
      this.currSelectRow = item
      this.currentFieldOpt.optType = this.currSelectRow.optType || 'none'
      this.currentFieldOpt.columnFormula = this.currSelectRow.colFormula
      this.currentFieldOpt.columnName = this.currSelectRow.columnName
      this.currentFieldOpt.columnDesc = this.currSelectRow.columnDesc
      this.currentFieldOpt.rawValue = this.currSelectRow.colFormula
      this.currentFieldOpt.rawDesc = this.currSelectRow.columnDesc
      this.currentFieldOpt.isStat = this.currSelectRow.isStat
    },
    getTableInfo (tableAlias) {
      let tabInfo = {}
      this.tableList.forEach(tab => {
        if (tableAlias === tab.tableAlias) {
          tabInfo = tab
          return false
        }
      })
      return tabInfo
    },
    calcFromTables () {
      this.groupPaneDisable = true
      let tempTables = new Set()
      this.selectFields.forEach(field => {
        if (field.isStat) {
          this.groupPaneDisable = false
        }
        tempTables.add(this.getTableInfo(field.tableAlias))
      })
      this.filterFields.forEach(field => tempTables.add(this.getTableInfo(field.tableAlias)))
      let topTable = ''
      tempTables.forEach(tab => {
        if (topTable === '') {
          topTable = tab.tableAlias
        } else {
          let len = 0
          for (let i = 0; i < topTable.length && i < tab.tableAlias.length; i++) {
            if (topTable.charCodeAt(i) === tab.tableAlias.charCodeAt(i)) {
              len++
            } else {
              break
            }
          }
          topTable = topTable.substr(0, len)
        }
      })
      if (topTable.endsWith('_')) {
        topTable = topTable.substr(0, topTable.length - 1)
      }
      let topTableLen = topTable.length + 1
      let tempTables2 = new Map()
      let tableT = this.getTableInfo(topTable)

      tableT.leftTable = ''
      tableT.leftTableCode = ''
      tableT.joinType = ''
      tableT.joinTypeSql = ''
      tableT.rightTable = tableT.title
      tableT.rightTableCode = tableT.table + ' ' + tableT.tableAlias

      tempTables2.set(topTable, tableT)
      tempTables.forEach(tab => {
        if (tab.tableAlias !== topTable) {
          let pads = tab.tableAlias.substr(topTableLen).split('_')
          let tempTab = topTable
          pads.forEach(t => {
            let leftTab = tempTab
            tempTab = tempTab + '_' + t
            if (!tempTables2.get(tempTab)) {
              let tableTemp = this.getTableInfo(tempTab)
              let tableLeft = this.getTableInfo(leftTab)
              tableTemp.leftTable = tableLeft.title
              tableTemp.leftTableCode = leftTab // tableLeft.table + ' ' + tableLeft.tableAlias
              tableTemp.joinType = tableTemp.joinType || '内链接'
              tableTemp.joinTypeSql = tableTemp.joinTypeSql || 'join'
              tableTemp.rightTable = tableTemp.title
              tableTemp.rightTableCode = tableTemp.table + ' ' + tableTemp.tableAlias
              tempTables2.set(tempTab, tableTemp)
            }
          })
        }
      })
      let tableInfos = []
      tempTables2.forEach((value) => tableInfos.push(value))
      tableInfos.sort((a, b) => a.tableAlias > b.tableAlias ? 1 : -1)
      this.selectTables = tableInfos
    },
    makeSelectFieldValue () {
      let cruField = {}
      cruField.colFormula = this.currentFieldOpt.columnFormula
      cruField.columnName = this.currentFieldOpt.columnName
      cruField.columnDesc = this.currentFieldOpt.columnDesc
      cruField.columnSql = this.currentFieldOpt.columnFormula
      cruField.tableAlias = this.currentFieldOpt.tableAlias
      if (this.currentFieldOpt.optType === 'colOpt') {
        // 1,2,3,4,5
        let sqlPieces = cruField.columnSql.replace(/([+\-*/(),])/g, '@#$1@#').split('@#').filter(w => w)
        let sqlSen = ''
        for (let s in sqlPieces) {
          if (/^\d+$/.test(sqlPieces[s].trim())) {
            let i = Number(sqlPieces[s].trim())
            if (i - 1 < this.selectFields.length) {
              sqlSen += this.selectFields[i - 1].columnSql
            } else {
              sqlSen += sqlPieces[s]
            }
          } else {
            sqlSen += sqlPieces[s]
          }
          // cruField.columnSql = cruField.columnSql.replace(i + 1, this.selectFields[i].columnSql)
        }
        cruField.columnSql = sqlSen
      }
      cruField.isStat = this.currentFieldOpt.isStat
      cruField.optType = this.currentFieldOpt.optType
      return cruField
    },
    clearCurrentFieldOpt () {
      this.currentFieldOpt.optType = 'none'
      this.currentFieldOpt.columnFormula = ''
      this.currentFieldOpt.columnName = ''
      this.currentFieldOpt.columnDesc = ''
      this.currentFieldOpt.rawValue = ''
      this.currentFieldOpt.rawDesc = ''
      this.currentFieldOpt.isStat = false
    },
    addSelectFieldEvent (event) {
      if (this.currentFieldOpt.columnName === '') {
        return
      }
      // 需要检查 this.currentFieldOpt.columnName 和列表中的别名有没有冲突，如果有冲突需要修改，否则不能添加
      for (let i = 0; i < this.selectFields.length; i++) {
        if (this.currentFieldOpt.columnName === this.selectFields[i].columnName) {
          this.$Message.error('字段别名重复，请修改 :' + this.currentFieldOpt.columnName)
          return
        }
      }
      let cruField = this.makeSelectFieldValue()
      cruField.colNo = this.selectFields.length + 1
      cruField._checked = true
      this.selectFields.push(cruField)
      this.clearCurrentFieldOpt()
      this.calcFromTables()
    },
    updateSelectFieldEvent (event) {
      let ind = -1
      let checked = true
      if (this.currSelectRow) {
        for (let i = 0; i < this.selectFields.length; i++) {
          if (this.currSelectRow.columnName === this.selectFields[i].columnName) {
            ind = i
            checked = this.currSelectRow._checked
            break
          }
        }
      }
      if (ind < 0) {
        return
      }
      for (let i = 0; i < this.selectFields.length; i++) {
        if (i !== ind && this.currentFieldOpt.columnName === this.selectFields[i].columnName) {
          this.$Message.error('字段别名重复，请修改 :' + this.currentFieldOpt.columnName)
          return
        }
      }
      let cruField = this.makeSelectFieldValue()
      cruField.colNo = ind + 1
      cruField._checked = checked
      this.$set(this.selectFields, ind, cruField)
      this.clearCurrentFieldOpt()
      // 这一句 不起作用，奇怪
      this.currSelectRow._highlight = true
      this.calcFromTables()
    },
    deleteSelectFieldEvent (event) {
      if (Object.keys(this.currSelectRow).length !== 0) {
        let ind = -1
        for (let i = 0; i < this.selectFields.length; i++) {
          if (this.currSelectRow.columnName === this.selectFields[i].columnName) {
            ind = i
          }
          if (ind >= 0 && i > ind) {
            this.selectFields[i].colNo = i
          }
        }
        if (ind >= 0) {
          this.selectFields.splice(ind, 1)
        }
      }
      this.calcFromTables()
    },
    moveSelectFieldUpEvent (event) {
      let ind = -1

      if (this.currSelectRow) {
        for (let i = 0; i < this.selectFields.length; i++) {
          if (this.currSelectRow.columnName === this.selectFields[i].columnName) {
            ind = i
            break
          }
        }
      }

      if (ind > 0) {
        const temp = this.selectFields[ind - 1]
        this.$set(this.selectFields, ind - 1, this.currSelectRow)
        this.$set(this.selectFields, ind, temp)
        this.currSelectRow._highlight = true
      }
    },
    moveSelectFieldDownEvent (event) {
      let ind = -1

      if (this.currSelectRow) {
        for (let i = 0; i < this.selectFields.length; i++) {
          if (this.currSelectRow.columnName === this.selectFields[i].columnName) {
            ind = i
            break
          }
        }
      }

      if (ind >= 0 && ind < this.selectFields.length - 1) {
        const temp = this.selectFields[ind + 1]
        this.$set(this.selectFields, ind + 1, this.currSelectRow)
        this.$set(this.selectFields, ind, temp)
        this.currSelectRow._highlight = true
      }
    },
    // 过滤条件树 点击事件
    onTreeFilterClick (selectedItem, clickItem) {
      if (clickItem.column) {
        this.filterFieldOpt.optType = 'none'
        this.filterFieldOpt.rawValue = clickItem.tableAlias + '.' + clickItem.column
        this.filterFieldOpt.fieldSql = clickItem.tableAlias + '.' + clickItem.column
        this.filterFieldOpt.rawDesc = clickItem.title
        this.filterFieldOpt.fieldDesc = clickItem.title
        this.filterFieldOpt.tableAlias = clickItem.tableAlias
      }
    },
    // 数据过滤页面 数据处理 选择
    onFilterFieldFuncChangeEvent (item) {
      // 需要一个标注输据库类型全局变量，根据不同的数据库拼接不同的函数
      if (this.filterFieldOpt.rawValue === '') {
        return
      }
      this.filterFieldOpt.fieldSql = item.value + '(' + this.filterFieldOpt.rawValue + ')'
      this.filterFieldOpt.fieldDesc = '对 ' + this.filterFieldOpt.rawDesc + ' ' + item.label
    },
    onFilterFieldLogicChangeEvent (item) {
      if (item !== undefined) {
        let params = 1
        this.filterFieldOpt.logicDesc = item.label
        this.filterLogics.forEach(logic => {
          if (item.value === logic.value) {
            params = logic.params
            return false
          }
        })
        if (params === 0) {
          this.logicParamShow = false
          this.logicParam2Show = false
        } else if (params === 2) {
          this.logicParamShow = true
          this.logicParam2Show = true
        } else {
          this.logicParamShow = true
          this.logicParam2Show = false
        }
      }
    },
    onFilterParamChangeEvent (item) {
      if (item !== undefined) {
        this.filterFieldOpt.logicParam = ':' + item.value
        this.filterFieldOpt.logicParamDesc = item.label
      }
    },
    onFilterParam2ChangeEvent (item) {
      if (item !== undefined) {
        this.filterFieldOpt.logicParam2 = ':' + item.value
        this.filterFieldOpt.logicParam2Desc = item.label
      }
    },
    makeFilterSqlValue () {
      let cruFilter = {}
      cruFilter.legal = this.filterFieldOpt.fieldSql && this.filterFieldOpt.filterLogic
      cruFilter.filterColumn = this.filterFieldOpt.fieldSql
      cruFilter.tableAlias = this.filterFieldOpt.tableAlias
      cruFilter.filterLogic = this.filterFieldOpt.logicDesc
      cruFilter.filterValue = this.filterFieldOpt.logicParamDesc || this.filterFieldOpt.logicParam
      if (this.filterFieldOpt.logicParam2) {
        cruFilter.filterValue += ',' + (this.filterFieldOpt.logicParam2Desc || this.filterFieldOpt.logicParam2)
      }

      let params = 1
      this.filterLogics.forEach(logic => {
        if (this.filterFieldOpt.filterLogic === logic.value) {
          params = logic.params
          return false
        }
      })
      if (params === 0) {
        cruFilter.filterValue = '--'
        cruFilter.filterSql = this.filterFieldOpt.fieldSql + this.filterFieldOpt.filterLogic
        cruFilter.filterDesc = this.filterFieldOpt.fieldDesc + this.filterFieldOpt.logicDesc
      } else if (params === 2) { // 目前只有 between
        if (!this.filterFieldOpt.logicParam || !this.filterFieldOpt.logicParam2) {
          cruFilter.legal = false
        }
        cruFilter.filterSql = this.filterFieldOpt.fieldSql + ' between ' + this.filterFieldOpt.logicParam + ' and ' + this.filterFieldOpt.logicParam2
        cruFilter.filterDesc = this.filterFieldOpt.fieldDesc + ' 介于 ' + (this.filterFieldOpt.logicParamDesc || this.filterFieldOpt.logicParam) +
          ' 和 ' + (this.filterFieldOpt.logicParam2Desc || this.filterFieldOpt.logicParam2) + ' 之间'
      } else {
        if (!this.filterFieldOpt.logicParam) {
          cruFilter.legal = false
        }
        if (this.filterFieldOpt.filterLogic === 'in()') {
          cruFilter.filterSql = this.filterFieldOpt.fieldSql + ' in (' + this.filterFieldOpt.logicParam + ')'
        } else {
          cruFilter.filterSql = this.filterFieldOpt.fieldSql + this.filterFieldOpt.filterLogic + this.filterFieldOpt.logicParam
        }
        cruFilter.filterDesc = this.filterFieldOpt.fieldDesc + this.filterFieldOpt.logicDesc + (this.filterFieldOpt.logicParamDesc || this.filterFieldOpt.logicParam)
      }
      return cruFilter
    },
    clearCurrentFilterOpt () {
      this.filterFieldOpt.optType = 'none'
      this.filterFieldOpt.fieldSql = ''
      this.filterFieldOpt.filterLogic = ''
      this.filterFieldOpt.logicParam = ''
      this.filterFieldOpt.logicParam2 = ''
      this.filterFieldOpt.logicParamSel = ''
      this.filterFieldOpt.logicParam2Sel = ''
      this.filterFieldOpt.fieldDesc = ''
    },
    addFilterSqlEvent (event) {
      let cruFilter = this.makeFilterSqlValue()
      cruFilter.filterNo = this.filterFields.length + 1
      if (cruFilter.legal) {
        this.filterFields.push(cruFilter)
        if (this.filterSqlFormula) {
          this.filterSqlFormula += ' * '
        }
        this.filterSqlFormula += cruFilter.filterNo
        this.clearCurrentFilterOpt()
        this.calcFromTables()
      }
    },
    updateFilterSqlEvent (event) {
      let ind = this.currFilterRow.filterNo
      let cruFilter = this.makeFilterSqlValue()
      if (cruFilter.legal) {
        cruFilter.filterNo = ind
        this.$set(this.filterFields, ind - 1, cruFilter)
        this.currFilterRow._highlight = true
        this.clearCurrentFilterOpt()
        this.calcFromTables()
      }
    },
    deleteFilterSqlEvent (event) {
      if (Object.keys(this.currFilterRow).length !== 0) {
        for (let i = this.currFilterRow.filterNo; i < this.filterFields.length; i++) {
          this.filterFields[i].filterNo = i
        }
        this.filterFields.splice(this.currFilterRow.filterNo - 1, 1)
        let sqlPieces = this.filterSqlFormula.replace(/([+*()])/g, '@#$1@#').split('@#').filter(w => w)
        let sqlSen = ''
        for (let s in sqlPieces) {
          if (sqlSen) {
            sqlSen += ' '
          }
          if (/^\d+$/.test(sqlPieces[s].trim())) {
            let i = Number(sqlPieces[s].trim())
            if (i > this.currFilterRow.filterNo) {
              sqlSen += (i - 1)
            } else if (i === this.currFilterRow.filterNo) {
              sqlSen += '0'
            } else {
              sqlSen += sqlPieces[s]
            }
          } else {
            sqlSen += sqlPieces[s]
          }
          // cruField.columnSql = cruField.columnSql.replace(i + 1, this.selectFields[i].columnSql)
        }
        this.filterSqlFormula = sqlSen
        this.calcFromTables()
      }
    },
    onJoinTypeChangeEvent (item) {
      if (this.joinOpt && this.joinOpt.leftTable) {
        for (let i = 0; i < this.selectTables.length; i++) {
          if (this.joinOpt.rightTableCode === this.selectTables[i].rightTableCode) {
            this.selectTables[i].joinType = item.label
            this.selectTables[i].joinTypeSql = item.value
            this.$set(this.selectTables, i, this.selectTables[i])
            this.joinOpt._highlight = true
            break
          }
        }
      }
    }
  },
  data () {
    return {
      // databaseType tableList tableFields 这三个属性需要从后台获取
      // 其中 tableList tableFields 需要分布获取
      databaseType: 'oracle',
      tableList: [
        {
          table: 'user_info',
          tableAlias: 'T',
          title: '用户信息表'
        },
        {
          title: '教育经历',
          table: 'user_educations',
          tableAlias: 'T_0',
          joinColumns: [
            {
              leftColumn: 'user_code',
              rightColumn: 'user_code'
            }
          ]
        },
        {
          title: '工作经历',
          table: 'user_career',
          tableAlias: 'T_1',
          joinColumns: [
            {
              leftColumn: 'user_code',
              rightColumn: 'user_code'
            }
          ]
        }
      ],
      tableFields: [
        {
          title: '主键',
          tableAlias: 'T',
          column: 'id'
        }, {
          title: '用户代码',
          tableAlias: 'T',
          column: 'user_code'
        }, {
          title: '用户姓名',
          tableAlias: 'T',
          column: 'user_name'
        }, {
          title: '用户电话',
          tableAlias: 'T',
          column: 'user_phone'
        },
        {
          title: '教育经历',
          table: 'user_educations',
          tableAlias: 'T_0',
          expand: true,
          children: [
            {
              title: '主键',
              tableAlias: 'T_0',
              column: 'id'
            },
            {
              title: '学历',
              tableAlias: 'T_0',
              column: 'edu_record'
            },
            {
              title: '学校',
              tableAlias: 'T_0',
              column: 'edu_school'
            },
            {
              title: '入学时间',
              tableAlias: 'T_0',
              column: 'begin_date'
            },
            {
              title: '毕业时间',
              tableAlias: 'T_0',
              column: 'end_date'
            }
          ]
        },
        {
          title: '工作经历',
          table: 'user_career',
          tableAlias: 'T_1',
          expand: true,
          children: [
            {
              title: '主键',
              tableAlias: 'T_1',
              column: 'id'
            },
            {
              title: '单位',
              tableAlias: 'T_1',
              column: 'work_unit'
            },
            {
              title: '工作内容',
              tableAlias: 'T_1',
              column: 'work_content'
            },
            {
              title: '入职时间',
              tableAlias: 'T_1',
              column: 'begin_date'
            },
            {
              title: '离职时间',
              tableAlias: 'T_1',
              column: 'end_date'
            }
          ]
        }
      ],
      // 返回数据 sqlSentence 为返回的sql语句，selectFields 字段说明，sqlParams 为参数说明
      sqlSentence: {
        fieldsSql: '',
        fromTableSql: '',
        whereSql: '',
        groupBySql: '',
        havingSql: '',
        orderBySql: '',
        fullSqlSen: ''
      },
      selectFields: [
        {
          colNo: 1,
          colFormula: 'T.user_name',
          columnName: 'user_name',
          columnDesc: '用户姓名',
          columnSql: 'T.user_name',
          tableAlias: 'T',
          isStat: false
        }
      ],
      sqlParams: [
        {
          name: '参数1',
          code: 'PRM_NO0',
          defaultValue: '100'
        },
        {
          name: '参数2',
          code: 'PRM_NO1',
          defaultValue: '200'
        }
      ],
      // 以下数据分为两类，一类为常量，比如表头信息，一类为运行的中间数据，这些数据都可以不用关心
      logicParamShow: false,
      logicParam2Show: false,
      groupPaneDisable: true,
      currSelectRow: {},
      currFilterRow: {},
      buttonSize: 'default',
      filterSqlFormula: '',
      currentFieldOpt: {
        optType: 'none',
        columnFormula: '',
        columnName: '',
        columnDesc: '',
        rawValue: '',
        rawDesc: '',
        isStat: false
      },
      sortOpt: {
        sortColumn: '',
        sortColumnDesc: '',
        sortType: 'asc'
      },
      joinOpt: {
        leftTable: '',
        leftTableCode: '',
        joinTypeSql: 'join',
        rightTable: '',
        rightTableCode: ''
      },
      filterFieldOpt: {
        optType: 'none',
        fieldSql: '',
        fieldDesc: '',
        filterLogic: '',
        logicParam: '',
        logicParam2: '',
        logicParamSel: '',
        logicParam2Sel: ''
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
          width: 50,
          align: 'center'
        },
        {
          title: '序',
          key: 'colNo',
          width: 50
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
      optFuncs: [
        {
          label: '无操作',
          value: 'none',
          isStat: false
        },
        {
          label: '大写',
          value: 'upperCase',
          isStat: false
        },
        {
          label: '小写',
          value: 'lowerCase',
          isStat: false
        },
        {
          label: '取整',
          value: 'int',
          isStat: false
        },
        {
          label: '求和',
          value: 'sum',
          isStat: true
        },
        {
          label: '计数',
          value: 'count',
          isStat: true
        },
        {
          label: '平均',
          value: 'average',
          isStat: true
        },
        {
          label: '方差',
          value: 'variance',
          isStat: true
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
      selectTables: [],
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
          title: '序',
          key: 'filterNo',
          width: 50
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
      filterFields: [],
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
          value: 'in()',
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
      havingFields: [],
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
      sortedFields: [],
      paramsCols: [
        {
          title: '参数描述',
          key: 'name'
        },
        {
          title: '默认值',
          key: 'defaultValue'
        }
      ]
    } // end of return
  }
}
</script>
