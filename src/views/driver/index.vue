<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" style="margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="add"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="driver" label="司机" align="center">
        <template #default>
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.nickname }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省" align="center" />
      <el-table-column prop="city" label="市" />
      <el-table-column prop="street" label="街道" align="center" />
      <el-table-column prop="detail" label="具体地址" align="center" />
      <el-table-column prop="mobile" label="电话号码" align="center" />

      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="query.nowPage"
      :page-size="query.pageSize"
      :page-sizes="[20, 50, 200, 300, 400]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next"
      :total="page.total"
    >
    </el-pagination>

    <!-- dialog -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="60%">
      <el-form ref="form">
        <el-form-item label="昵称" required>
          <el-input
            prop="nickname"
            v-model="form.nickname"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" required>
          <el-input
            prop="mobile"
            v-model="form.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="收货地址" required
          ><br />
          <el-row>
            <el-col :span="8">
              <el-select
                prop="province"
                v-model="form.province"
                placeholder="请选择省份"
                @change="provinceChange($event)"
              >
                <el-option
                  v-for="item in apiAddress.provinceList"
                  :key="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                prop="city"
                v-model="form.city"
                placeholder="请选择城市"
                @change="cityChange($event)"
              >
                <el-option
                  v-for="item in apiAddress.cityList"
                  :key="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                prop="street"
                v-model="form.street"
                placeholder="请选择县区"
              >
                <el-option
                  v-for="item in apiAddress.countyList"
                  :key="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="详细地址" required>
          <el-input
            prop="detail"
            type="textarea"
            v-model="form.detail"
            autocomplete="off"
          ></el-input>
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
  getProvince,
  create,
  pageByCondition,
  updateById,
  deleteById,
} from "@/api/address/address";
export default {
  data() {
    return {
      dialog: {
        visible: false,
        title: "新增",
      },
      apiAddress: {
        provinceList: [],
        cityList: [],
        countyList: [],
        CITY: [],
        XIAN: [],
      },
      form: {
        nickname: "",
        province: "",
        city: "",
        street: "",
        detail: "",
        mobile: "",
        userId: this.$store.getters.userId,
      },
      query: {
        userId: this.$store.getters.userId,
        nowPage: 1,
        pageSize: 20,
      },
      tableData: [],
      page: {
        total: 0,
      },
    };
  },
  mounted() {
    this.getProvince();
    this.getTableData();
  },
  methods: {
    getTableData() {
      pageByCondition(this.query).then((res) => {
        const { records } = res.data;
        const { total } = res.data;
        this.tableData = records;
        this.page.total = total;
      });
    },
    getProvince() {
      getProvince().then((res) => {
        this.apiAddress.provinceList = res.districts[0].districts; /* 省*/
        let newProvince = this.apiAddress.provinceList;
        for (let i = 0; i < newProvince.length; i++) {
          /* 省级*/
          for (let j = 0; j < newProvince[i].districts.length; j++) {
            /* 市级*/
            let city = newProvince[i].districts[j].name;
            this.apiAddress.CITY.push({ id: j + 1, name: city, code: i + 1 });
            for (
              let k = 0;
              k < newProvince[i].districts[j].districts.length;
              k++
            ) {
              /* 县级*/
              let xian = newProvince[i].districts[j].districts[k].name;
              this.apiAddress.XIAN.push({
                id: k + 1,
                name: xian,
                code: j + 1,
                cityCountyName: city,
              });
            }
          }
        }
        for (let m = 0; m < newProvince.length; m++) {
          newProvince[m] = { ...newProvince[m], ...{ code: m + 1 } };
        }
        this.apiAddress.provinceList = newProvince;
      });
    },
    add() {
      this.dialog.title = "新增";
      this.dialog.visible = true;
    },

    edit(row) {
      this.form = row;
      this.dialog.title = "编辑";
      this.dialog.visible = true;
    },

    remove(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteById(row.id).then((res) => {
          if (res.code == 200) {
            this.$notify.success(res.message);
            this.getTableData();
          } else {
            this.$notify.error(res.message);
          }
        });
      });
    },

    confirm() {
      if (!this.form.id) {
        create(this.form).then((res) => {
          if (res.code == 200) {
            this.$notify.success(res.message);
            this.dialog.visible = false;
            this.$refs["form"].resetFields();
            this.getTableData();
          } else {
            this.$notify.error(res.message);
          }
        });
      } else {
        updateById(this.form).then((res) => {
          if (res.code == 200) {
            this.$notify.success(res.message);
            this.dialog.visible = false;
            this.$refs["form"].resetFields();
            this.getTableData();
          } else {
            this.$notify.error(res.message);
          }
        });
      }
    },

    provinceChange(that) {
      // 根据选中省，匹配市
      let cityCode = 0;
      let newCityArry = [];
      this.apiAddress.provinceList.forEach((item, index) => {
        if (item.name == that) {
          cityCode = item.code;
        }
      });
      if (cityCode) {
        this.apiAddress.cityList = [];
        this.apiAddress.CITY.forEach((item, index) => {
          if (item.code == cityCode) {
            this.apiAddress.cityList.push(item);
          }
        }); /* 市匹配成功*/
      }
    },

    cityChange(that) {
      let countyCode = 0;
      let cityname = "";
      let newCountyArry = [];
      this.apiAddress.cityList.forEach((item, index) => {
        if (item.name == that) {
          countyCode = item.id;
          cityname = item.name;
        }
      });
      if (countyCode) {
        this.apiAddress.countyList = [];
        this.apiAddress.XIAN.forEach((item, index) => {
          if (item.code == countyCode && item.cityCountyName == cityname) {
            this.apiAddress.countyList.push(item);
          }
        });
      }
    },

    handleSizeChange(size) {
      this.query.pageSize = size;
      this.getTableData();
    },

    handleCurrentChange(nowPage) {
      this.query.nowPage = nowPage;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
