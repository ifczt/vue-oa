<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="drawer = true">
        搜索条件
      </el-button>
      <el-button v-show="roles.includes('IFCZT')||roles.includes('ADMIN')" type="success" @click="handleDownload">
        新单导出
      </el-button>
      <el-button v-show="roles.includes('IFCZT')||roles.includes('FINANCE')||roles.includes('ADMIN')" type="warning" @click="upload = true">
        导入数据
      </el-button>
      <el-button v-show="roles.includes('IFCZT')||roles.includes('FINANCE')" type="success" @click="financeDownload">
        财务信息导出
      </el-button>
      <el-drawer
        title="搜索"
        :visible.sync="drawer"
        :direction="direction"
        size="245px"
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
            style="width: 160px;margin-top: 9px;"
            class="filter-item"
            multiple
            collapse-tags
          >
            <el-option label="未派送" value="0" />
            <el-option label="已签收" value="1" />
            <el-option label="换货" value="2" />
            <el-option label="退货" value="3" />
            <el-option label="在投" value="4" />
            <el-option label="再投" value="5" />
            <el-option label="问题件" value="6" />
            <el-option label="取消" value="7" />
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
          <el-cascader
            v-model="listQuery.buy_product"
            :options="product_group_options_b"
            :show-all-levels="false"
            :props="{ multiple: true,emitPath:false }"
            clearable
            collapse-tags
            style="width: 265px;margin-top: 10px;"
          />
          <!--          <el-select-->
          <!--            v-model="listQuery.buy_product"-->
          <!--            placeholder="产品名称"-->
          <!--            clearable-->
          <!--            class="filter-item"-->
          <!--            style="width: 250px;margin-top: 10px;"-->
          <!--            multiple-->
          <!--            collapse-tags-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="item in product_name_options"-->
          <!--              :label="item.name"-->
          <!--              :value="item.id"-->
          <!--            />-->
          <!--          </el-select>-->
          <el-autocomplete
            v-model="listQuery.input_staff"
            :fetch-suggestions="queryName"
            placeholder="录入员"
            style="padding: 0;"
            @select="query_name_select"
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
            style="width: 180px;margin-top: 9px;"
            class="filter-item"
          >
            <el-option label="派单时间" value="1" />
            <el-option label="录单时间" value="4" />
            <el-option label="回款日期" value="2" />
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
          <el-divider direction="vertical" />
          <el-switch
            v-model="t_apply_discount_state"
            active-text="已申请折扣"
            inactive-text="未申请折扣"
            active-value="1"
            inactive-value="0"
            @change="switch_value('apply')"
          />
          <el-divider direction="vertical" />
          <el-switch
            v-model="t_payment_state"
            active-text="已回款"
            inactive-text="未回款"
            active-value="1"
            inactive-value="0"
            @change="switch_value('payment')"
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
      :expand-row-keys="expands"
      :row-key="getRowKeys"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单编号:">
              <span><el-tag type="info">{{ scope.row.id }}</el-tag></span>
            </el-form-item>
            <el-form-item label="宣传编号:">
              <span><el-tag type="info">{{ scope.row.ppg_id }}</el-tag></span>
            </el-form-item>
            <el-form-item label="所属加盟商:">
              <span><el-tag>{{ scope.row.publicist }}</el-tag></span>
            </el-form-item>
            <el-form-item label="所属学校:">
              <span><el-tag>{{ scope.row.school }}</el-tag></span>
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
              <span><el-tag>{{ scope.row.apply_discount_state_bool===2?'已同意': scope.row.apply_discount_state_bool===1?'申请中':'未申请' }}</el-tag></span>
            </el-form-item>
            <el-form-item label="订单录入员:">
              <span><el-tag type="info">{{ scope.row.input_staff }}</el-tag></span>
            </el-form-item>
            <el-form-item label="派送方式:">
              <span><el-tag type="info">{{ scope.row.delivery }}</el-tag></span>
            </el-form-item>
            <el-form-item label="联系电话:">
              <span><el-tag type="info">{{ scope.row.phone }}</el-tag></span>
            </el-form-item>
            <el-form-item v-if="scope.row.courier_code" label="快递单号:">
              <span><el-tag type="info">{{ scope.row.courier_code }}</el-tag></span>
            </el-form-item>
            <el-form-item v-if="scope.row.courier_code_return" label="退货单号:">
              <span><el-tag type="info">{{ scope.row.courier_code_return }}</el-tag></span>
            </el-form-item>
            <el-form-item v-if="scope.row.courier_code_relapse" label="换货单号:">
              <span><el-tag type="info">{{ scope.row.courier_code_relapse }}</el-tag></span>
            </el-form-item>
            <el-form-item v-if="scope.row.remarks" label="备注:">
              <span><el-tag type="success">{{ scope.row.remarks }}</el-tag></span>
            </el-form-item>
            <el-form-item v-if="scope.row.payment" label="收取费用:">
              <span><el-tag type="info">{{ scope.row.payment }}元</el-tag></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column min-width="160px" align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.buy_product }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="收件人">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.consignee }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="物流状态">
        <template slot-scope="scope">
          <span><el-tag
            :type="scope.row.delivery_state==='未发货'?'info':scope.row.delivery_state==='已签收'?'success':'danger'"
          >{{ scope.row.delivery_state }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="代收货款" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}元</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="运费" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.freight?scope.row.freight+'元':'暂未结算' }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="发货时间" width="110">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.delivery_time | parseTime('{y}-{m}-{d}') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="结款时间" width="110">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.refund_time" type="info">{{ scope.row.refund_time | parseTime('{y}-{m}-{d}') }}
          </el-tag>
          <el-tag v-if="!scope.row.refund_time" type="info">暂未回款</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="roles.includes('IFCZT')||roles.includes('ADMIN')" align="center" label="操作" min-width="318">
        <template v-if="scope.row.delivery_state!=='退货'" slot-scope="scope">
          <el-tooltip
            v-if="scope.row.apply_discount_state&&scope.row.delivery_state==='未发货'"
            class="item"
            effect="dark"
            :content="apply_discount_text(scope.row.auxiliary_apply)"
            placement="top-start"
          >
            <el-button
              type="primary"
              :icon="approval_ico(scope.row.auxiliary_apply)"
              @click="change_apply(scope.row.id,scope.row.auxiliary_apply)"
            />
          </el-tooltip>
          <el-button type="primary" style="margin-left: 0" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
          <el-popconfirm
            title="确定要删除这条数据吗？"
            @onConfirm="del_list(scope.$index,scope.row.id)"
          >
            <el-button slot="reference" :loading="is_del_server" type="danger" icon="el-icon-delete" />
          </el-popconfirm>
          <el-tooltip class="item" effect="dark" content="换货" placement="top">
            <el-button
              type="warning"
              style="margin-left: 0"
              icon="el-icon-guide"
              @click="return_goods(scope.row.id,'swap',scope.$index)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="退货" placement="top">
            <el-button
              type="info"
              style="margin-left: 0"
              icon="el-icon-switch-button"
              @click="return_goods(scope.row.id,'return',scope.$index)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 430px; margin-left:50px;"
      >
        <el-form-item label="购买产品" prop="buy_product">
          <el-cascader
            v-model="temp.buy_product"
            :options="product_group_options"
            :show-all-levels="false"
            :props="{emitPath:false }"
            clearable
            style="width: 220px;"
            @change="changeProduct"
          />
          <!--          <el-select-->
          <!--            v-model="temp.buy_product"-->
          <!--            value-key="id"-->
          <!--            class="filter-item"-->
          <!--            placeholder="点击选择"-->
          <!--            @change="changeProduct"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="item in product_name_options"-->
          <!--              :id="item.id"-->
          <!--              :label="item.name"-->
          <!--              :value="item"-->
          <!--              :price="item.price"-->
          <!--            />-->
          <!--          </el-select>-->
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
            v-model="temp.ppg_id"
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
        <el-button type="primary" :loading="is_server_input" @click="updateData()">
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
    <el-dialog title="导入数据" :visible.sync="upload">
      <upload-excel-component :on-success="uploadExcSuccess" :before-upload="beforeUploadExc" />
      <div class="tips_text_class">
        <span>{{ tips_text }}</span>
        <div style="margin-top: -25px">
          <el-button
            v-show="roles.includes('IFCZT')||roles.includes('ADMIN')"
            size="mini"
            type="info"
            @click="downTemplate('wl')"
          >物流模板</el-button>
          <el-button
            v-show="roles.includes('IFCZT')||roles.includes('FINANCE')||roles.includes('ADMIN')"
            size="mini"
            type="info"
            @click="downTemplate('th')"
          >退货模板</el-button>
          <el-button
            v-show="roles.includes('IFCZT')||roles.includes('FINANCE')"
            size="mini"
            type="info"
            @click="downTemplate('cw')"
          >财务模板
          </el-button>
          <el-button
            v-show="roles.includes('IFCZT')||roles.includes('FINANCE')"
            size="mini"
            type="info"
            @click="downTemplate('yf')"
          >运费模板</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="return_and_swap_title" :visible.sync="return_goods_visible" width="450px">
      <el-form
        ref="returnForm"
        :model="return_temp"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="快递单号">
          <el-input v-model="return_temp.courier_code_return" style="width: 200px" />
        </el-form-item>
        <el-form-item label="收取费用">
          <el-input-number v-model="return_temp.payment" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="return_goods_visible = false">取消</el-button>
        <el-button type="primary" @click="return_swap">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./index.js"/>

<style scoped>
  .tips_text_class {
    border: 2px dashed #bbb;
    width: 600px;
    height: 120px;
    line-height: 75px;
    margin: 0 auto 13px auto;
    font-size: 18px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }

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
