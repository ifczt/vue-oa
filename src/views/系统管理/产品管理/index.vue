<template>
  <div>
    <el-row v-for="(arr, index) of copy_list" :key="index" type="flex" justify="center">
      <el-col
        v-for="item of arr"
        :span="5"
        style="margin:20px 20px 0 20px;"
      >
        <el-card v-if="item.id" :body-style="{ padding: '0px' }" style="cursor:pointer;height: 80px" shadow="hover">
          <div v-if="item.id" style="height: 80px;text-align: center" @click="show_product(item)">
            <h1>{{ item.name }}</h1>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px">
      <el-input v-model="product_name" placeholder="请输入产品名称" style="width: 300px;margin-left: 28px">
        <template slot="prepend">产品名称</template>
      </el-input>
      <el-input-number v-model="price" :min="0" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btn_loading" @click="creat_express">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="product_group_name" :visible.sync="dialog_product" width="60%">
      <el-button>新增产品</el-button>
      <el-table
        v-loading="table_loading"
        :data="table_list"
        stripe
        fit
        highlight-current-row
        height="500px"
      >
        <el-table-column label="产品名称" align="center" min-width="200px">
          <template slot-scope="{row}">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="100px">
          <template slot-scope="{row}">
            {{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="折扣" align="center" width="100px">
          <template slot-scope="{row}">
            {{ row.convert }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="100px">
          <template slot-scope="{row}">
            {{ row.active===1||row.active===true?'已启用':'已禁用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info" plain @click="edit(scope.row)">修改</el-button>
            <el-button v-show="scope.row.active" size="mini" type="info" plain @click="active(scope.row,true)">禁用</el-button>
            <el-button v-show="!scope.row.active" size="mini" type="success" plain @click="active(scope.row,false)">启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script src="./index.js"/>
<style src="./index.css"/>
