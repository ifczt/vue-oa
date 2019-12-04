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
        <div class="card-panel">
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
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <tab-pane v-if="activeName===item.key" :type="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="新增学校宣传" :visible.sync="dialogFormVisible">
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
        </el-form-item>
        <el-form-item label="发放量" label-width="120px">
          <el-input-number v-model="school_form.dosage" :min="0" label="描述文字" />
        </el-form-item>
        <el-form-item label="是单数" label-width="120px">
          <el-input-number v-model="school_form.sales_nums" :min="0" label="描述文字" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="input_school_ext">确 定</el-button>
      </div>
    </el-dialog>
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
</style>
