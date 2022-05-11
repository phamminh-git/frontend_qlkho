<template>
  <div>
    <div class="hold-transition login-page">
      <div class="login-box">
        <div class="login-logo">
          <span>
            <img src="../../../public/dist/img/AdminLTELogo.png" alt="AdminLTE Logo">
            <b>Kho Hồng Anh</b>
          </span>
        </div>
        <!-- /.login-logo -->
        <div class="card card-outline card-primary">
          <div class="card-body login-card-body">
            <h4 class="login-box-msg">Đăng nhập</h4>
            <form action="http://34.81.253.110/api/login" @submit.prevent="login()">
              <div class="input-group mb-3">
                <input type="tel" class="form-control" placeholder="Số điện thoại" v-model="loginUser.phone">
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-phone"></span>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3">
                <input type="password" class="form-control" placeholder="Mật khẩu" v-model="loginUser.password">
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div>
                <span v-if="errors" class="form-message">
                  <span v-if="errors && errors.phone"
                  class="text-danger"
                  >
                    {{errors.phone[0]}}
                  </span>
                </span>
              </div>
              <div class="row justify-content-center">
                <!-- /.col -->
                <div class="col-8">
                  <button type="submit" class="btn btn-primary btn-block btn-flat">
                    <span class="fas fa-sign-in-alt"></span>
                    Đăng nhập
                    </button>
                </div>
                <!-- /.col -->
              </div>
            </form>
          </div>
          <!-- /.login-card-body -->
        </div>
      </div>
      <!-- /.login-box -->

    </div>
  </div>
</template>
<script>

export default{
  name: 'dangnhap',
  data(){
    return{
      loginUser: {
        phone: null,
        password: null,
        device: 'web'
      },
      errors: {},
      change_password: {
        phone: null,
      }
    }
  },
  methods:{
    async login(){
      this.errors = await this.$store.dispatch('login', this.loginUser)
      if (this.errors == null){
        this.$router.push({name: 'DashboardAdmin'});
        window.location.reload()
      }
    },
  },
}
</script>
<style scoped>
.col-8{
  padding-top: 7px;
}
.col-4{
  padding-right: 5px;
  padding-left: 4px;
}
.remember{
  margin-bottom: 0rem;
  margin-left: 5px;
}
img{
  height: 50px;
  vertical-align: middle;
  border-style: none;
  padding-right: 10px;
}
.login-logo{
  font-size: 2.1rem;
  font-weight: 300;
  margin-bottom: .9rem;
  text-align: center;
}
</style>
