<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="drawer = true">
        搜索条件
      </el-button>
      <el-button type="success" @click="drawer = true">
        导出数据
      </el-button>
      <el-button type="warning" @click="drawer = true">
        导入数据-物流状态
      </el-button>
      <el-drawer
        title="搜索"
        :visible.sync="drawer"
        :direction="direction"
        size="30%"
        :before-close="handleClose"
        style="text-align: center"
        :with-header="false"
      >
        <el-row style="margin-top: 30px">
          <el-input
            v-model="listQuery.courier_code"
            placeholder="快递单号"
            style="width: 200px;margin-top: 9px;"
            class="filter-item"
            @keyup.enter.native="search_cri"
          />
          <el-input
            v-model="listQuery.parent"
            placeholder="家长姓名"
            style="width: 130px;margin-top: 9px;"
            class="filter-item"
          />
          <el-input
            v-model="listQuery.phone"
            placeholder="手机号码"
            style="width: 180px;margin-top: 9px;"
            class="filter-item"
          />
          <el-select
            v-model="listQuery.delivery_state"
            placeholder="快递状态"
            clearable
            style="width: 120px;margin-top: 9px;"
            class="filter-item"
            multiple
            collapse-tags
          >
            <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
          </el-select>
          <el-select
            v-model="listQuery.delivery"
            placeholder="派送方式"
            clearable
            style="width: 150px;margin-top: 9px;"
            class="filter-item"
            multiple
            collapse-tags
          >
            <el-option v-for="item in delivery_mode_options" :value="item.id" :label="item.name" />
          </el-select>
        </el-row>
        <el-row>
          <el-select
            v-model="listQuery.buy_product"
            placeholder="产品名称"
            clearable
            class="filter-item"
            style="width: 250px;margin-top: 10px;"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in product_name_options"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-autocomplete
            v-model="listQuery.input_staff"
            :fetch-suggestions="null"
            placeholder="录入员"
            style="padding: 0;"
          />
          <el-cascader
            v-model="listQuery.area"
            size="large"
            :options="china_options"
            placeholder="指定区域"
            @change="area_select"
          />

          <el-select
            v-model="listQuery.type_time_slot"
            placeholder="时间段指定类型"
            clearable
            style="width: 150px;margin-top: 9px;"
            class="filter-item"
          >
            <el-option label="派单时间" value="1" />
            <el-option label="录单时间" value="4" />
            <el-option label="结款日期" value="2" />
            <el-option label="记账时间" value="3" />
          </el-select>
        </el-row>
        <el-row>
          <el-date-picker
            v-model="listQuery.time_slot_value"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="picker_time_slot"
            :disabled="listQuery.type_time_slot===''"
            value-format="yyyy-MM-dd"
          />
        </el-row>
        <el-row>
          <el-button
            class="filter-item"
            style="margin-top: 10px;"
            type="success"
            icon="el-icon-search"
            @click="search_cri"
          >
            搜索
          </el-button>
        </el-row>
      </el-drawer>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="宣传编号:">
              <span><el-tag type="info">{{ scope.row.ppg_id }}</el-tag></span>
            </el-form-item>
            <el-form-item label="所属加盟商:">
              <span><el-tag>{{ scope.row.publicist }}</el-tag></span>
            </el-form-item>
            <el-form-item label="学生姓名:">
              <span><el-tag type="info">{{ scope.row.student }}</el-tag></span>
            </el-form-item>
            <el-form-item label="付款方式:">
              <span><el-tag :type="scope.row.pay_method==='1'?'warning':''">{{ scope.row.pay_method==="1"?"货到付款":"线上支付" }}</el-tag></span>
            </el-form-item>
            <el-form-item label="地址:">
              <span><el-tag>{{ scope.row.address }}</el-tag></span>
            </el-form-item>
            <el-form-item label="申请折扣状态:">
              <span><el-tag>{{ scope.row.apply_discount_state?"申请中":"未申请" }}</el-tag></span>
            </el-form-item>
            <el-form-item label="订单录入员:">
              <span><el-tag type="info">{{ scope.row.input_staff }}</el-tag></span>
            </el-form-item>
            <el-form-item label="联系电话:">
              <span><el-tag type="info">{{ scope.row.phone }}</el-tag></span>
            </el-form-item>
            <el-form-item label="快递单号:">
              <span><el-tag type="info">{{ scope.row.courier_code }}</el-tag></span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160px" align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.buy_product }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="所属学校">
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="家长姓名">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.parent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="物流状态">
        <template slot-scope="scope">
          <span><el-tag
            :type="scope.row.delivery_state==='未发货'?'info':scope.row.delivery_state==='签收'?'success':'danger'"
          >{{ scope.row.delivery_state }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="售价" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="发货时间" width="110">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.delivery_time | parseTime('{y}-{m}-{d}') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="派送方式">
        <template slot-scope="scope">
          <span>{{ scope.row.delivery }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="190">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="同意折扣申请" placement="top-start">
              <el-button type="primary" :icon="approval_ico" disabled />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除订单" placement="top-start">
              <el-button type="primary" icon="el-icon-delete" @click="del_list(scope.$index,scope.row.id)" />
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 430px; margin-left:50px;"
      >
        <el-form-item label="购买产品" prop="buy_product">
          <el-select
            v-model="temp.buy_product"
            value-key="id"
            class="filter-item"
            placeholder="点击选择"
            @change="changeProduct"
          >
            <el-option
              v-for="item in product_name_options"
              :id="item.id"
              :label="item.name"
              :value="item"
              :price="item.price"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="派单时间" prop="delivery_time">
          <el-date-picker
            v-model="temp.delivery_time"
            type="date"
            placeholder="选择希望发货的时间"
            align="right"
            :picker-options="picker_date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="宣传编号" prop="ppg_id">
          <el-input
            v-model.number="temp.ppg_id"
            show-word-limit
            suffix-icon="el-icon-share"
            maxlength="6"
            @change="changePpg_id"
          />
        </el-form-item>
        <el-form-item label="学校名称" prop="school">
          <el-input v-model="temp.school" disabled />
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="temp.student" style="width: 125px;" />
          <el-button type="primary" icon="el-icon-edit" @click="auto_cname">自动</el-button>
          <el-radio v-model="temp.consignee" label="2" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="家长姓名">
          <el-input v-model="temp.parent" style="width: 218px;" />
          <el-radio v-model="temp.consignee" label="1" border>收件人</el-radio>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-radio v-model="temp.pay_method" label="1">货到付款</el-radio>
          <el-radio v-model="temp.pay_method" label="2" @change="temp.apply_discount_state=false">微信支付</el-radio>
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-cascader v-model="temp.area" size="large" :options="china_options" @change="area_select" />
          <el-input v-model="temp.address" style="margin-top: 5px;" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.number="temp.phone" />
        </el-form-item>
        <el-form-item label="派送方式" prop="delivery">
          <el-select
            v-model="temp.delivery"
            value-key="id"
            class="filter-item"
            placeholder="点击选择"
          >
            <el-option
              v-for="item in delivery_mode_options"
              :id="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="temp.pay_method==='1'" label="申请折扣">
          <el-switch v-model="temp.apply_discount_state" />
        </el-form-item>
        <el-form-item v-show="temp.apply_discount_state" label="价格调整">
          <el-input-number v-model="temp.price" :min="0" :max="1290" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="is_server_input" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding: 0"
      @pagination="getList()"
    />
  </div>
</template>
<script src="./index.js"/>

<style>
  .edit-input {
    padding-right: 100px;
  }

  .el-input--medium .el-input__inner {
    height: 40px;
    line-height: 40px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .el-table .warning-row {
    background: #ffebf0;
  }

  .demo-table-expand label {
    width: 110px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

</style>
