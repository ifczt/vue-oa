<template>
  <div>
    <el-row v-for="(arr, index) of copy_list" :key="index" type="flex" justify="center">
      <el-col
        v-for="item of arr"
        :span="4"
        style="margin:20px 20px 0 20px;"
      >
        <el-card v-show="item.u_id" :body-style="{ padding: '0px' }" style="cursor:pointer;height: 80px" shadow="hover">
          <div v-if="item.u_id" style="height: 80px;text-align: center" @click="show_region(item)">
            <h1>{{ item.username }}</h1>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="title" width="95%" :visible.sync="dialogFormVisible" top="10vh">
      <el-button type="primary" @click="embedFormVisible=true">新增签约</el-button>
      <div style="text-align: center;width: 100%">
        <el-table
          v-loading="table_loading"
          :data="region_list"
          stripe
          fit
          highlight-current-row
          :height="table_height"
        >
          <el-table-column label="负责省份" align="center" width="100px">
            <template slot-scope="{row}">
              {{ row.province }}
            </template>
          </el-table-column>
          <el-table-column label="负责市">
            <template slot-scope="scope">
              <el-tag
                v-for="tag in scope.row.city"
                :key="tag.id"
                type="info"
                style="margin-right: 3px;margin-bottom: 3px"
                closable
                @close="tagClose(tag,scope.row,scope.$index)"
              >{{ tag.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="签约产品">
            <template slot-scope="scope">
              <el-tag
                v-for="tag in scope.row.product"
                :key="tag.id"
                style="margin-right: 3px;margin-bottom: 3px"
                closable
                @close="product_tagClose(tag,scope.row,scope.$index)"
              >{{ tag.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="合同有效期" width="200px">
            <template slot-scope="{row}">
              {{ row.time_slot }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="el-icon-edit" @click="edit_contract(scope.row,scope.$index)" />
              </el-tooltip>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="remove_province(scope.$index,scope.row.province)"
              >
                <el-tooltip slot="reference" class="item" effect="dark" content="解约" placement="top">
                  <el-button type="primary" icon="el-icon-delete" />
                </el-tooltip>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="padding: 0;margin-top: 15px"
        @pagination="get_region_list"
      />
      <el-dialog width="720px" :title="embed_title" :visible.sync="embedFormVisible" append-to-body>
        <el-row style="padding-left: 35px;margin-top: 10px">
          <el-select
            v-model="temp.province"
            placeholder="请选择省份"
            style="width: 140px"
            clearable
            :disabled="province_dis"
            @change="change_province"
            @clear="clear_province"
          >
            <el-option v-for="item in province_options" :label="item.label" :value="item.value" />
          </el-select>
          <el-select
            v-model="temp.city"
            multiple
            collapse-tags
            placeholder="请选择市"
            style="width: 180px"
            @change="change_city"
          >
            <el-option v-for="item in city_options" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="temp.product" multiple collapse-tags placeholder="请选择产品" style="width: 240px">
            <el-option v-for="item in product_options" :label="item.name" :value="item.id" />
          </el-select>
        </el-row>
        <el-row style="padding-left: 35px;margin-bottom: 10px">
          <el-date-picker
            v-model="temp.time_slot"
            type="daterange"
            :picker-options="picker_time_slot"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-top: 10px"
            value-format="yyyy-MM-dd"
          />
          <el-button type="primary" style="width: 215px" @click="input_terr">签订合约</el-button>
        </el-row>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script src="./index.js"/>
<style src="./index.css"/>
