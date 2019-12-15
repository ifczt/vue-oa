<template>
  <div class="bgColor" :style="{'height': body_height}">
    <el-row :gutter="30" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="dialogFormVisible = true">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              添加学校推广
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="show_school">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              查看所负责学校信息
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tab-container">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="tabsClick">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <tab-pane v-if="activeName===item.key" :ref="item.key" :type="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="新增学校宣传" :visible.sync="dialogFormVisible">
      <el-dialog
        width="30%"
        :title="edit_add"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form ref="school_form" :model="school_edit_form" :rules="rules">
          <el-form-item label="学校名称" label-width="120px" prop="school_name">
            <el-input v-model="school_edit_form.school_name" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="学校地址" label-width="120px">
            <el-input v-model="school_edit_form.school_address" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="所属区域" prop="area" label-width="120px">
            <el-cascader
              v-model="school_edit_form.area"
              size="large"
              :options="china_options"
              placeholder="指定区域"
              @change="area_select"
            />
          </el-form-item>
          <el-form-item label="学校质量" prop="quality" label-width="120px">
            <el-select v-model="school_edit_form.quality" placeholder="学校质量" clearable class="filter-item">
              <el-option value="顶尖" />
              <el-option value="优良" />
              <el-option value="良好" />
              <el-option value="一般" />
              <el-option value="差" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式" label-width="120px">
            <el-input
              v-model="school_edit_form.contact_info"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="school_edit">确 定</el-button>
        </div>
      </el-dialog>
      <el-form :model="school_form">
        <el-form-item label="学校名称" label-width="120px">
          <el-autocomplete
            v-model="school_form.school"
            popper-class="my-autocomplete"
            :fetch-suggestions="query_school"
            placeholder="请输入内容"
            @select="query_school_Select"
          >
            <i slot="suffix" class="el-icon-edit el-input__icon" />
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}<br><span class="addr">{{ item.region }}</span></div>
            </template>
          </el-autocomplete>
          <el-tooltip class="item" effect="dark" content="添加学校" placement="top">
            <el-button type="primary" icon="el-icon-plus" @click="add_school" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="发放量" label-width="120px">
          <el-input-number v-model="school_form.dosage" :min="0" label="描述文字" />
        </el-form-item>
        <el-form-item label="是单数" label-width="120px">
          <el-input-number v-model="school_form.sales_nums" :min="0" label="描述文字" />
        </el-form-item>
      </el-form>
      <el-card v-show="school_tip_show" shadow="never">
        <span><el-tag>所属区域：{{ school_tip_region }}</el-tag></span>
        <span><el-tag>地址：{{ school_tip_address }}</el-tag></span>
        <span><el-tag>质量：{{ school_tip_quality }}</el-tag></span>
        <el-tooltip content="点击修改信息" placement="top">
          <el-button type="primary" icon="el-icon-edit" style="float: right" @click="show_edit_school" />
        </el-tooltip>
      </el-card>
      <div v-show="school_tip_show" style="width: 100%;text-align: center">
        <span style="color: rgba(5,0,6,0.42)">如信息有误，请点击右侧按钮修改，大谋良好的市场生态需要你我共同努力，十分感谢。</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="input_school_ext">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="学校查看"
      :visible.sync="drawer"
      size="60%"
      align="center"
    >
      <el-row>
        <el-select
          v-model="listQuery.province"
          placeholder="省"
          clearable
          class="filter-item"
          style="width: 100px"
          value-key="id"
          @change="change_options"
        >
          <el-option v-for="item in province_options" :id="item.id" :label="item.name" :value="item" />
        </el-select>
        <el-select
          v-model="listQuery.city"
          placeholder="市"
          clearable
          class="filter-item"
          style="width: 100px"
          value-key="id"
        >
          <el-option v-for="item in city_options" :id="item.id" :label="item.name" :value="item" />
        </el-select>
        <el-select v-model="listQuery.quality" placeholder="学校质量" clearable class="filter-item" style="width: 100px">
          <el-option value="顶尖" />
          <el-option value="优良" />
          <el-option value="良好" />
          <el-option value="一般" />
          <el-option value="差" />
        </el-select>
      </el-row>
      <el-row>
        <el-input
          v-model="listQuery.school_name"
          placeholder="学校名字"
          style="width: 248px;margin-top: 9px;"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          style="margin-top: 10px;"
          type="success"
          icon="el-icon-search"
          @click="search_school_list"
        />
      </el-row>
      <el-table
        v-loading="school_table_loading"
        :data="school_list"
        stripe
        fit
        highlight-current-row
        style="width: 90%"
        :height="table_height"
      >
        <el-table-column
          label="学校名称"
        >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top-start">
              <p>区域: {{ scope.row.region }}</p>
              <p>地址: {{ scope.row.school_address }}</p>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.school_name }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="质量" width="110">
          <template slot-scope="{row}">
            {{ row.quality }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="padding: 0;margin-top: 15px"
        @pagination="get_school_list"
      />
    </el-drawer>
  </div>
</template>

<script src="./index.js"/>

<style lang="scss">
  .my-autocomplete {
    li {
      line-height: normal;
      /*padding: 7px 0 7px 20px;*/

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 5px 5px 5px 0;
      }

      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }

  .tab-container {
    margin: 0px 20px 10px 20px;
  }

  .bgColor {
    background-color: rgb(240, 242, 245);
  }

  .panel-group {
    .card-panel-col {
      margin-left: 20px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 55px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }

  .el-drawer__header span {
    outline: none;
  }

  .el-drawer__header i {
    outline: none;
  }

  .el-drawer__wrapper div {
    outline: none;
  }
</style>
