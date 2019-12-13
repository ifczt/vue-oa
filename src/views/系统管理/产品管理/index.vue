<template>
  <div>
    <el-row v-for="(arr, index) of copy_list" :key="index" type="flex" justify="center">
      <el-col
        v-for="item of arr"
        :span="4"
        style="margin:20px 20px 0 20px;"
      >
        <el-card v-show="item.id" v-if="!item.add" :body-style="{ padding: '0px' }">
          <el-image
            v-if="item.id"
            style="height: 150px;width: 100%"
            :src="'http://zn.net/img/product/'+1+'.jpg'"
            fit="cover"
          />
          <div v-if="item.id" style="padding: 5px 8px; height: 80px">
            <div style="width: 100%;text-align: center">
              <el-tag type="info" style="margin-bottom: 5px">{{ item.name }}</el-tag>
              <el-tag style="margin-bottom: 5px">{{ item.price }}元</el-tag>
              <el-button size="mini" type="info" plain @click="edit(item)">修改</el-button>
              <el-button v-show="item.active" size="mini" type="info" plain @click="active(item,true)">禁用</el-button>
              <el-button v-show="!item.active" size="mini" type="success" plain @click="active(item,false)">启用
              </el-button>
              <el-popconfirm
                title="你现在的这个操作很危险，请确认!删除后所有关联该产品的订单将看不见产品名称只能看到一个ID,如非必要请选择禁用，孩子。"
                style="padding-left: 10px"
                @onConfirm="e_delete(item.id)"
              >
                <el-button slot="reference" size="mini" type="danger" plain>删除</el-button>
              </el-popconfirm>
            </div>
          </div>
        </el-card>
        <el-card v-else style="height: 230px;text-align: center" shadow="hover">
          <svg-icon
            icon-class="添加信息"
            style="padding-left:10px;width: 10rem;height: 10rem;padding-top: 2.5rem;cursor:pointer"
            @click="show_add_product"
          />
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
  </div>
</template>

<script src="./index.js"/>
<style src="./index.css"/>
