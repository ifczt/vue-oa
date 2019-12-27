<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" style="margin-right: 10px" @click="handleCreate">添加账号</el-button>
      <el-input v-model="listQuery.search_str" placeholder="请输入姓名" style="width: 200px;">
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column align="center" label="用户编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用户类别">
        <template slot-scope="scope">
          <span>{{ scope.row.power }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="本年度销量">
        <template slot-scope="scope">
          <span>{{ scope.row.yeah_sales_volume }}元</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="总销量">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sales_volume }}元</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="签收率">
        <template slot-scope="scope">
          <span>{{ scope.row.signing_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="最近登陆时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="用户状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.active?'':'danger'">{{ scope.row.active?'已启用':'已禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="190">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改密码及权限" placement="top-start">
            <el-button v-if="scope.row.username!==my_name" icon="el-icon-edit" type="primary" circle @click="editUser(scope.row)" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="user_is_off_tips[scope.row.active?1:0]"
            placement="top-start"
          >
            <el-button
              v-if="scope.row.username!==my_name"
              :type="user_is_off_type[scope.row.active?1:0]"
              :icon="user_is_off_icon[scope.row.active?1:0]"
              circle
              style="margin-bottom: 0;margin-left: 5px"
              @click="active(scope.row)"
            />
          </el-tooltip>
          <el-popconfirm
            title="你现在的这个操作很危险，请确认!删除后所有关联该用户的所有数据都将消失,如非必要请选择禁用。"
            style="padding-left: 10px"
            @onConfirm="m_del_user(scope.$index,scope.row.id)"
          >
            <el-button
              v-if="scope.row.username!==my_name"
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              circle
              style="margin-bottom: 0"
            />
          </el-popconfirm>
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
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="temp.username" :disabled="username_dis" />
        </el-form-item>
        <el-form-item label="账号密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="check_password">
          <el-input v-model="temp.check_password" show-password />
        </el-form-item>
        <el-form-item label="用户类别" prop="power">
          <el-select v-model="temp.power" class="filter-item" placeholder="点击选择">
            <el-option
              v-for="item in power_group"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding: 0"
      @pagination="getList"
    />
  </div>
</template>

<script src="./index.js"/>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

</style>
