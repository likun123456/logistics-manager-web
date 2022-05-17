<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" style="margin-bottom: 10px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="openDialog"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="tableData" border height="250" style="width: 100%">
      <el-table-column prop="call" label="昵称">
        <template #default="scope">
          <el-tag>{{ scope.row.call }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省" />
      <el-table-column prop="city" label="市" />
      <el-table-column prop="street" label="街道" />
      <el-table-column prop="detail" label="具体地址" />
      <el-table-column prop="mobile" label="电话号码" />

      <el-table-column fixed="right" label="Operations" width="180">
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

    <!-- dialog -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="60%">
      <el-form>
        <el-form-item label="昵称" required>
          <el-input v-model="form.call" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机号" required>
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="收货地址" required
          ><br />
          <el-row>
            <el-col :span="8">
              <el-select
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
                v-model="form.cityList"
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
              <el-select v-model="form.street" placeholder="请选择县区">
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
          <el-input type="textarea" v-model="form.detail" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProvince, create } from "@/api/address/address";
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
        call: "",
        province: "",
        city: "",
        street: "",
        detail: "",
        mobile: "",
      },
      tableData: [
        {
          province: "湖北省",
          city: "武汉市",
          street: "佛祖岭街道",
          detail:
            "佛祖岭C区1栋2单元沙发沙发萨芬撒发放安抚  法法师发发放散阀 发地方",
          call: "昆仔",
          mobile: "15323258562",
        },
        {
          province: "湖北省",
          city: "武汉市",
          street: "佛祖岭街道",
          detail: "佛祖岭C区1栋2单元",
          call: "昆仔",
          mobile: "15323258562",
        },
      ],
    };
  },
  mounted() {
    this.getProvince();
  },
  methods: {
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
    openDialog() {
      this.dialog.visible = true;
    },

    add() {},

    edit(row) {
      console.log(row);
    },

    remove(row) {},

    confirm() {
      create(this.form).then(res => {
        console.log(res)
      })
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
  },
};
</script>

<style lang="scss" scoped>
</style>
