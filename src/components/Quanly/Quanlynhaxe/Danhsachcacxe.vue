<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2 v-if="Garage !== null">{{ Garage['name'] }}</h2>
    <h3 v-if="Garage !== null">{{ Garage['phoneNumber'] }}</h3>
    <div class="alert alert-success" v-if="register_success">Thêm xe thành công</div>
    <div class="alert alert-success" v-if="fix_success">Lưu thành công</div>
    <b-button @click="showregister = !showregister" class="d-flex justify-content-start mx-2 button_register_car btn-sm" v-if="checkPermission([9])">Thêm xe</b-button>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Biển số xe</th>
          <th>Số điện thoại</th>
          <th>Lộ trình</th>
          <th v-if="checkPermission([10])"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(car,index) in cars" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ car['licensePlate'] }}</td>
          <td>{{ car['phoneNumber'] }}</td>
          <td>
            <span class="route" v-show="car['route'] !== null">{{ car['route'] }}</span>
            <span class="not_route" v-show="car['route'] == null"></span>
          </td>
          <td v-if="checkPermission([10])">
            <b-button @click="sendid(car['id'])" class="btn-sm" variant="success">Sửa</b-button>
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
      @change="getlistCar"
      ></b-pagination>
    </div>
    <b-modal v-model="showfix" v-bind:hide-footer="true" title="Sửa thông tin xe">
      <form class="form" action="" @submit.prevent="fix()">
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập biển số xe mới" v-model="fixCar.licensePlate">
            <div class="text-danger" align="center" v-if="errors_fix_car !== null && errors_fix_car.licensePlate" >
              {{ errors_fix_car.licensePlate[0] }}
            </div>  
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="tel" class="form-control" placeholder="Số điện thoại mới" v-model="fixCar.phoneNumber">
            <div class="text-danger" align="center" v-if="errors_fix_car !== null && errors_fix_car.phoneNumber" >
              {{ errors_fix_car.phoneNumber[0] }}
            </div> 
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập lộ trình mới" v-model="fixCar.route">
          </div>
        </div>
        <div class="px-5 py-2">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <b-modal v-model="showregister" title="Thêm xe" v-bind:hide-footer="true">
      <form action="" @submit.prevent="register()">
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập biển số xe" v-model="registerCar.licensePlate">  
            <div class="text-danger" align="center" v-if="errors_register_car !== null && errors_register_car.licensePlate" >
              {{ errors_register_car.licensePlate[0] }}
            </div>  
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="tel" class="form-control" placeholder="Số điện thoại" v-model="registerCar.phoneNumber">
            <div class="text-danger" align="center" v-if="errors_register_car !== null && errors_register_car.phoneNumber" >
              {{ errors_register_car.phoneNumber[0] }}
            </div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập lộ trình" v-model="registerCar.route">
            <div class="text-danger" align="center" v-if="errors_register_car !== null && errors_register_car.route" >
              Lộ trình không được để trống
            </div>
          </div>
        </div>
        <div class="px-5 py-2">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from '../../../store/BaseRequest'

export default {
  props: ['id'],
  created: function(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.getlistCar(1)
  },
  filters:{
    route(lotrinh){
      if (lotrinh == null){
        return "Chưa nhập"
      }else{
        return lotrinh
      }
    }
  },
  data(){
    return {
      Garage: null,
      registerCar: {
        licensePlate: null,
        phoneNumber: null,
        route: null,
        carrental_id: this.id
      },
      errors_register_car: null,
      cars: null,
      register_success: false,
      car_id: null,
      showfix: false,
      showregister: false,
      fixCar:{
        licensePlate: null,
        phoneNumber: null,
        route: null,
        carrental_id: this.id
      },
			fix_success: false,
      errors_fix_car: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false,
      user: {},
      permissionIds: [],
    }
  },
  methods: {
    getlistCar: function(page){
      this.loading = true;
      BaseRequest.get('/carrental/' + this.id)
      .then(response => {
        this.loading = false;
        this.Garage = response.data
        BaseRequest.get('/car?carrental_id=' + this.id + '&per_page=' + this.perPage, {page})
        .then(response => {
          this.cars = response.data.data
          this.currentPage = response.data.current_page;
          this.rows = response.data.total;
        })
      }) 
    },
    register: function(){
      BaseRequest.post('/car', this.registerCar)
      .then( () => {
        setTimeout(() => {
          this.register_success = false;
        }, 1000);
        this.showregister = false;
        this.register_success = true;
        this.registerCar.licensePlate = null;
        this.registerCar.phoneNumber = null;
        this.registerCar.route = null;
        this.errors_register_car = null;
        this.getlistCar(this.currentPage)
      })
      .catch( error => {
        this.errors_register_car = error.response.data.errors
      })
    },
    sendid: function(id){
      this.car_id = id;
      this.showfix = true;
      BaseRequest.get('/car/' + id + '/edit')
      .then( response => {
        this.fixCar = response.data
      })
    },
    fix: function(){
			BaseRequest.put('/car/' + this.car_id, this.fixCar)
			.then( () => {
        setTimeout(() => {
          this.fix_success = false;
        }, 1000);
        this.showfix = false;
        this.fix_success = true;
				this.fixCar.licensePlate = null;
				this.fixCar.phoneNumber = null;
				this.fixCar.route = null;
        this.errors_fix_car = null;
        this.getlistCar(this.currentPage)
      })
			.catch( error => {
				this.errors_fix_car = error.response.data.errors
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
.px-6{
  padding-right: 12.8rem !important;
  padding-left: 12.8rem !important;
}
.form-control{
  width: 100%;
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
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.button_register_car{
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
  .px-5 {
    padding-right: 10rem !important;
    padding-left: 10rem !important;
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
	td:nth-of-type(2):before { content: "Biển số xe"; }
	td:nth-of-type(3):before { content: "Số điện thoại"; }
  td .not_route:before { 
    position: absolute;
		top: 1px;
		left: 6px;
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
    content: "Lộ trình"; }
	td .route:nth-of-type(1):before { 
    position: absolute;
		top: 12px;
		left: 6px;
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
    content: "Lộ trình"; }
	td:nth-of-type(4):before { content: ""; }
}
</style>