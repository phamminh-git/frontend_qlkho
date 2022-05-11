<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Danh sách nhà xe</h2>
    <div class="alert alert-success" v-if="registerSuccess">Đăng ký thành công</div>
    <div class="alert alert-success" v-if="fix_success">Lưu thành công</div>
    <div class="d-flex justify-content-between px-2 pt-3">
      <div id="search-box" class="mx-2 mb-2">
        <b-form-input type="text" placeholder="Nhập tên nhà xe" v-model="garageName" v-debounce:300ms="searchByCar"></b-form-input>
      </div>	
      <b-button @click="showregister = !showregister" class="d-flex justify-content-start mx-2 button_register_garage btn-sm" v-if="checkPermission([7])">Thêm nhà xe</b-button>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên nhà xe</th>
          <th>Số điện thoại</th>
          <th>Loại</th>
          <th></th>
          <!-- <th></th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(getGarage, index) in getGarages" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{getGarage['name']}}</td>
          <td><a :href="`tel:${getGarage['phoneNumber']}`">{{getGarage['phoneNumber']}}</a></td>
          <td>{{getGarage['isHome'] | isHome}}</td>
          <td>
            <b-button @click="sendid(getGarage['id'])" class="fix btn-sm mx-2" variant="success" v-if="checkPermission([8])">Sửa</b-button>
          <!-- </td>
          <td> -->
            <router-link :to="{ path: '/dashboardadmin/danhsachnhaxe/danhsachcacxe/' + getGarage['id']}" class="router-link" v-if="checkPermission([9,10])">
            Danh sách xe
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <div class="d-flex justify-content-center">
      <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      ></b-pagination>
    </div>
    <b-modal v-model="showfix" v-bind:hide-footer="true" title="Sửa thông tin nhà xe">
      <form action="http://34.81.253.110/api/carrental" @submit.prevent="fix()">
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Tên nhà xe mới" v-model="fix_Garage.name">
            <div class="text-danger" align="center" v-if="errors_fix !== null && errors_fix.name" >
              {{ errors_fix.name[0] }}
            </div>    
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="tel" class="form-control" placeholder="Số điện thoại mới" v-model="fix_Garage.phoneNumber">
            <div class="text-danger" align="center" v-if="errors_fix !== null && errors_fix.phoneNumber" >
              {{ errors_fix.phoneNumber[0] }}
            </div> 
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <b-form-group label="Chọn loại mới" v-slot="{ ariaDescribedby }">
              <b-form-radio v-model="fix_Garage.isHome" :aria-describedby="ariaDescribedby" name="some-radios" value="1">Nhà xe của kho</b-form-radio>
              <b-form-radio v-model="fix_Garage.isHome" :aria-describedby="ariaDescribedby" name="some-radios" value="0">Nhà xe ngoài</b-form-radio>
            </b-form-group>
            <div class="text-danger" align="center" v-if="errors_fix !== null && errors_fix.isHome" >
              {{ errors_fix.isHome[0] }}
            </div> 
          </div>
        </div>
        <div class="px-6 py-2">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <b-modal v-model="showregister" title="Thêm nhà xe" v-bind:hide-footer="true">
      <form action="http://34.81.253.110/api/carrental" @submit.prevent="register()">
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Họ và tên" v-model="registerGarage.name">  
            <div class="text-danger" align="center" v-if="errors_register_garage !== null && errors_register_garage.name" >
              {{ errors_register_garage.name[0] }}
            </div>  
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="tel" class="form-control" placeholder="Số điện thoại" v-model="registerGarage.phoneNumber">
            <div class="text-danger" align="center" v-if="errors_register_garage !== null && errors_register_garage.phoneNumber" >
              {{ errors_register_garage.phoneNumber[0] }}
            </div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <b-form-group label="Chọn loại" v-slot="{ ariaDescribedby }">
              <b-form-radio v-model="registerGarage.isHome" :aria-describedby="ariaDescribedby" name="some-radios" value="1">Nhà xe của kho</b-form-radio>
              <b-form-radio v-model="registerGarage.isHome" :aria-describedby="ariaDescribedby" name="some-radios" value="0">Nhà xe ngoài</b-form-radio>
            </b-form-group>
            <div class="text-danger" align="center" v-if="errors_register_garage !== null && errors_register_garage.isHome" >
              {{ errors_register_garage.isHome[0] }}
            </div>
          </div>
        </div>
        <div class="px-5 py-2">
          <button type="submit" class="btn btn-primary" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from '../../../store/BaseRequest'

export default {
  created: function(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.getlistGarage(1)
  },
  filters: {
    isHome(id){
      if( id == 1){
        return 'Nhà xe của kho'
      }else{
        return 'Nhà xe ngoài'
      }
    }
  },
  data(){
    return {
      getGarages: null,
      registerGarage: {
        name: null,
        phoneNumber: null,
        isHome: null
      },
      errors_register_garage: null,
      registerSuccess: false,
      Garage_id: null,
      fix_Garage: {
        name: null,
        phoneNumber: null,
        isHome: null
      },
      showfix: false,
      errors_fix: null,
			fix_success: false,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      showregister: false,
      garageName:'',
      loading:false,
      user: {},
      permissionIds: [],
    }
  },
  watch: {
    currentPage: function(){
      if(this.garageName != null){
        this.searchByCar()
      }
      else{
        this.getlistGarage()
      }
    }
  },
  methods:{
    getlistGarage: function(page){
      this.loading = true;
      BaseRequest.get('/carrental?per_page=' + this.perPage, {page})
      .then(response => {
        this.loading = false;
        this.getGarages = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    searchByCar() {
      BaseRequest.get('/carrental?per_page=' + this.perPage + "&key_word=" + this.garageName, {page:this.currentPage})
      .then(response => {
        this.getGarages = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    register: function(){
      BaseRequest.post('/carrental', this.registerGarage)
      .then( () => {
        this.showregister = false;
        setTimeout(() => {
          this.registerSuccess = false;
        }, 1000);
        this.registerSuccess = true;
        this.registerGarage.name = null;
        this.registerGarage.phoneNumber = null;
        this.registerGarage.isHome = null;
        this.errors_register_garage = null;
        this.getlistGarage(this.currentPage)
      })
      .catch( error => {
        this.errors_register_garage = error.response.data.errors;
      })
    },
    sendid: function(id){
      this.Garage_id = id;
      this.showfix = true;
      BaseRequest.get('/carrental/' + id + '/edit')
      .then( response => {
        this.fix_Garage = response.data
      })
    },
    fix: function(){
      BaseRequest.put('/carrental/' + this.Garage_id, this.fix_Garage)
			.then( () => {
        this.showfix = false;
        setTimeout(() => {
          this.fix_success = false;
        }, 1000);
        this.fix_success = true;
        this.fix_Garage.name = null;
        this.fix_Garage.phoneNumber = null;
        this.fix_Garage.isHome = null;
        this.errors_fix = null;
        this.getlistGarage(this.currentPage)
			})
      .catch( error => {
        this.errors_fix = error.response.data.errors
      })
    },
    hasHistory () { return window.history.length > 2 },
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
    },
  }
}
</script>

<style scoped>
.px-5 {
  padding-right: 12.6rem !important;
  padding-left: 12.6rem !important;
}
.router-link{
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.router-link:hover{
  background-color: #0069d9;
  border-color: #0062cc;
}
.px-6{
  padding-right: 12.8rem !important;
  padding-left: 12.8rem !important;
}
.form-control{
  width: 100%;
  display: block;
}
.input-search{
  display: inline-block;
  width: 55%;
  height: calc(2.25rem + 2px);
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  box-shadow: inset 0 0 0 transparent;
}
.input-search:focus{
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: inset 0 0 0 transparent;
}
.button_register_garage{
  margin-bottom: 20px;
}
@media 
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px)  {
	table, thead, tbody, th, td, tr { 
		display: block; 
	}
	thead tr { 
		position: absolute;
		top: -9999px;
		left: -9999px;
	}
	tr { border: 1px solid #ccc; }
	td { 
		border: none;
		border-bottom: 1px solid #eee; 
		position: relative;
		padding-left: 50%; 
	}
	td:before { 
		position: absolute;
		top: 12px;
		left: 6px;
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
	}
	td:nth-of-type(1):before { content: "STT"; }
	td:nth-of-type(2):before { content: "Tên nhà xe"; }
	td:nth-of-type(3):before { content: "Số điện thoại"; }
	td:nth-of-type(4):before { content: "Loại"; }
	td:nth-of-type(5):before { content: ""; }
}
</style>