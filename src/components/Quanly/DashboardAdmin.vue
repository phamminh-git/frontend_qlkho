<template>
  <div>
    <!-- Site wrapper -->
    <div class="wrapper">
      <!-- Navbar -->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
          </li>
        </ul>

        <div class="alert alert-success" v-if="fix_success">Đổi mật khẩu thành công</div>
        <ul class="navbar-nav ml-auto">
          <li>
            <div class="info">
              <span class="d-block brand-text font-weight-light" v-if="user != null">{{user.name}}</span>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
              <i class="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
          <li>
            <b-button class="btn btn-sm" variant="outline-success" @click="showfixpass = !showfixpass" >Đổi mật khẩu</b-button>
          </li>
          <li class="button-logout">
            <b-button variant="outline-danger" class="btn btn-sm" @click="logout()">Đăng xuất</b-button>
          </li>
        </ul>
      </nav>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <aside class="main-sidebar main-sidebar-custom sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="#" class="brand-link">
          <img src="../../../public/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
          <span class="brand-text font-weight-light">Kho Hồng Anh</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li class="nav-item" v-if="checkPermission([1,2,3,4,5,6,12,14,15])">
                <a href="#" class="nav-link">
                  <i class="fas fa-calendar-check"></i>
                  <p>
                    Đơn hàng
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item" v-if="checkPermission([1,2,3,4,5,6])">
                    <router-link :to="{ name: 'Donhangchuanhan' }" class="nav-link">
                      <i class="fas fa-boxes"></i>
                      Chưa về kho
                    </router-link>
                  </li>
                  <li class="nav-item" v-if="checkPermission([12])">
                    <router-link :to="{ name: 'Donhangdanhan' }" class="nav-link">
                      <i class="fas fa-box-open"></i>
                      Đã nhập kho
                    </router-link>
                  </li>
                  <li class="nav-item" v-if="checkPermission([14,15])">
                    <router-link :to="{ name: 'Donhangdagiao' }" class="nav-link">
                      <i class="fas fa-people-carry"></i>
                      Đã giao
                    </router-link>                    
                  </li>
                </ul>
              </li>
              <li class="nav-item" v-if="checkPermission([11])">
                <router-link :to="{ name: 'Xacnhandonhang' }" class="nav-link">
                  <i class="fas fa-boxes"></i>
                  Nhập kho mặt hàng
                </router-link>
              </li>     
              <li class="nav-item" v-if="checkPermission([13])">
                <router-link :to="{ name: 'Xephanglenxe' }" class="nav-link">
                  <i class="fas fa-people-carry"></i>
                  Xếp hàng lên xe
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission()">
                <router-link :to="{ name: 'Nhanvien' }" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  Nhân viên
                </router-link>
              </li>                    
              <!-- ========= -->
              <li class="nav-item" v-if="checkPermission([7,8,9,10])">
                <router-link :to="{ path: '/dashboardadmin/danhsachnhaxe' }" class="nav-link">
                  <i class="nav-icon fas fa-truck"></i>
                  Quản lý nhà xe
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission([17])">
                <router-link :to="{ name: 'Danhsachnhaxe' }" class="nav-link">
                  <i class="fas fa-truck-loading"></i>
                  Hàng đang trên xe
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission([18,19,20])">
                <router-link :to="{ name: 'ChiPhiCauDuong' }" class="nav-link">
                  <i class="nav-icon fas fa-road"></i>
                  Chi phí di chuyển
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission([16])">
                <router-link :to="{ name: 'Danhsachmathang' }" class="nav-link">
                  <i class="nav-icon fas fa-warehouse"></i>
                  Quản lý tồn kho
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission()"> 
                <router-link :to="{ name: 'Doanhthu' }" class="nav-link">
                  <i class="nav-icon fas fa-receipt"></i>
                  <p>Thống kê doanh thu</p>
                </router-link>
              </li>
              <li class="nav-item" v-if="checkPermission([21,22])">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-money-check-alt"></i>
                  <p>
                    Quản lý công nợ
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item" v-if="checkPermission([21])">
                    <router-link :to="{ name: 'Congnonhaxechuathanhtoan' }" class="nav-link">
                      <i class="fas fa-boxes"></i>
                      Chưa thanh toán
                    </router-link>
                  </li>
                  <li class="nav-item" v-if="checkPermission([22])">
                    <router-link :to="{ name: 'Congnonhaxedathanhtoan' }" class="nav-link">
                      <i class="fas fa-box-open"></i>
                      Đã thanh toán
                    </router-link>
                  </li>
                </ul>
              </li>
              <!-- ====== -->
              <li class="nav-item" v-if="checkPermission()">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-file-invoice"></i>
                  <p>
                    Tiền thu hộ
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <router-link :to="{ name: 'Donhangchuathanhtoan' }" class="nav-link">
                      <i class="fas fa-boxes"></i>
                      Chưa thanh toán
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link :to="{ name: 'Donhangdathanhtoan' }" class="nav-link">
                      <i class="fas fa-box-open"></i>
                      Đã thanh toán
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="nav-item" v-if="user.role_id ==1">
                <router-link :to="{ name: 'Lichsuhoatdong' }" class="nav-link">
                  <i class="fas fa-history"></i>
                  Lịch sử hoạt động
                </router-link>
              </li>
              <li class="nav-item" v-else>
                <router-link :to="{ name: 'Danhsachlichsu', params: { id:user.id }}" class="nav-link">
                  <i class="fas fa-history"></i>
                  Lịch sử hoạt động
                </router-link>
              </li>
            </ul>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar-custom -->
      </aside>
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
      <!-- /.content-wrapper -->
    </div>
    <b-modal v-model="showfixpass" v-bind:hide-footer="true" title="Đổi mật khẩu">
      <form action="" @submit.prevent="fixpassword()">
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="password"
              class="form-control"
              placeholder="Mật khẩu cũ"
              v-model="fixpass.password"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.password"
            >{{ errors_fix.password[0] }}</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="password"
              class="form-control"
              placeholder="Mật khẩu mới"
              v-model="fixpass.new_password"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.new_password"
            >{{ errors_fix.new_password[0] }}</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="password"
              class="form-control"
              placeholder="Xác nhận mật khẩu mới"
              v-model="fixpass.new_password_confirmation"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.new_password_confirmation"
            >{{ errors_fix.new_password_confirmation[0] }}</div>
          </div>
        </div>
        <div class="px-6 py-2">
          <button type="submit" class="btn btn-primary" align="center">Đổi mật khẩu</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from '../../store/BaseRequest'

export default {
  created: function(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
  },
  data(){
    return{
      user: null,
      showfixpass: false,
      fixpass: {
        password: null,
        new_password: null,
        new_password_confirmation: null
      },
      errors_fix: null,
      fix_success: false,
      permissionIds: []
    }
  },
  methods: {
    logout: function(){
      BaseRequest.post('/logout', {})
      .then( () => {
        window.localStorage.removeItem('user');
        this.$router.push({name: 'Login'});
      })
      .catch( () => {

      })
    },
    fixpassword: function(){
      BaseRequest.post('/change-password', this.fixpass)
      .then( () => {
        this.showfixpass = false;
        this.fix_success = true;
        this.errors_fix = null
      })
      .catch( error => {
        this.errors_fix = error.response.data.errors
      })
    },
    checkPermission: function(id = []){
      if(this.user.role_id == 1)
        return true;
      else{
        for(let i=0; i < id.length; i++){
          if(this.permissionIds.includes(id[i])){
            return true;
          }
        }
      }
      return false;
    }
  }
}
</script>

<style scoped>
@import "~admin-lte/dist/css/adminlte.min.css";
@import "~admin-lte/plugins/fontawesome-free/css/all.min.css";
i{
  padding-right: 10px;
}
.main-sidebar{
  height: 100vh !important;
  position:fixed !important;
  left: 0 !important;
  top:0;
}
router-link{
  text-decoration: none;
}
.right{
  padding: 0;
}
.nav-link{
  text-align: left;
}
.d-block{
  color: #1f2d3d;
  font-size: 1.5rem;
  margin: auto 0px;
}
.button-logout{
  margin-left: 10px;
}
.px-6 {
  padding-right: 10.8rem !important;
  padding-left: 10.8rem !important;
}
.alert{
  margin-bottom: 0rem !important;
  width: 730px;
}
</style>
