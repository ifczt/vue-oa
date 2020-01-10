<template>
  <div style="margin-top: 15vh">
    <el-row type="flex" justify="center" align="middle" style="height: 100%">
      <el-card :body-style="{ padding: '0px'}" shadow="hover" style="width: 450px">
        <img src="https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646" class="image">
        <div class="bottom clearfix">
          <div style="padding: 10px">
            <el-input v-model="passwordOld" placeholder="请输入密码" show-password autocomplete="new-password">
              <template slot="prepend">输入原始密码</template>
            </el-input>
          </div>
          <div style="padding: 10px">
            <el-input v-model="passwordNew" placeholder="请设置密码" show-password autocomplete="new-password">
              <template slot="prepend">重新设置密码</template>
            </el-input>
          </div>
          <el-button
            v-show="btn_show"
            type="primary"
            style="float:right;margin-right: 10px;margin-bottom: 10px"
            :loading="btn_loading"
            @click="change_edit"
          >
            提交
          </el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script src="./index.js"/>
<style src="./index.css"/>
