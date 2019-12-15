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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-button type="primary">新增签约</el-button>
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
                :type="colors[Math.floor(Math.random()*colors.length)]"
                v-for="tag in scope.row.city"
                :key="tag.id"
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
                :type="colors[Math.floor(Math.random()*colors.length)]"
                v-for="tag in scope.row.city"
                :key="tag.id"
                style="margin-right: 3px;margin-bottom: 3px"
                closable
                @close="tagClose(tag,scope.row,scope.$index)"
              >{{ tag.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="el-icon-edit" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="解约" placement="top">
                <el-button type="primary" icon="el-icon-delete" />
              </el-tooltip>
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
    </el-dialog>
  </div>
</template>

<script src="./index.js"/>
<style src="./index.css"/>
