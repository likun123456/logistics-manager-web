<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" style="margin-bottom: 10px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="add"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="driver" label="司机" align="center">
        <template #default>
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="gender" label="性别" align="center">
        <template #default="scope">
          <el-tag effect="dark" :type="computedGender(scope.row.gender)">{{
            scope.row.genderName
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="mobile" label="电话号码" align="center" />

      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="remove(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="query.nowPage"
      :page-size="query.pageSize"
      :page-sizes="[20, 50, 200, 300, 400]"
      background
      layout="total, sizes, prev, pager, next"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- dialog -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="60%">
      <el-form ref="form">
        <el-form-item label="姓名" required>
          <el-input
            v-model="form.name"
            prop="name"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="手机号" required>
          <el-input
            v-model="form.mobile"
            prop="mobile"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="性别" required>
          <el-radio-group v-model="form.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="-1">外星人</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  create,
  pageByCondition,
  updateById,
  deleteById
} from '@/api/driver/driver'
export default {
  data() {
    return {
      dialog: {
        visible: false,
        title: '新增'
      },
      form: {
        name: '',
        mobile: '',
        gender: 0
      },
      query: {
        nowPage: 1,
        pageSize: 20
      },
      tableData: [],
      page: {
        total: 0
      }
    }
  },
  computed: {
    computedGender() {
      return (gender) => {
        switch (gender) {
          case 0:
            return ''
          case 1:
            return 'danger'
          default:
            return 'warning'
        }
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      pageByCondition(this.query).then((res) => {
        const { records } = res.data
        const { total } = res.data
        this.tableData = records
        this.page.total = total
      })
    },
    add() {
      this.dialog.title = '新增'
      this.dialog.visible = true
    },

    edit(row) {
      this.form = row
      this.dialog.title = '编辑'
      this.dialog.visible = true
    },

    remove(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.message)
            this.getTableData()
          } else {
            this.$notify.error(res.message)
          }
        })
      })
    },

    confirm() {
      if (!this.form.id) {
        create(this.form).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.message)
            this.dialog.visible = false
            this.$refs['form'].resetFields()
            this.getTableData()
          } else {
            this.$notify.error(res.message)
          }
        })
      } else {
        updateById(this.form).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.message)
            this.dialog.visible = false
            this.$refs['form'].resetFields()
            this.getTableData()
          } else {
            this.$notify.error(res.message)
          }
        })
      }
    },

    handleSizeChange(size) {
      this.query.pageSize = size
      this.getTableData()
    },

    handleCurrentChange(nowPage) {
      this.query.nowPage = nowPage
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
