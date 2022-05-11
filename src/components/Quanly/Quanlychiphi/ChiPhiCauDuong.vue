<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Danh sách xe</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Biển số xe</th>
          <th>Số điện thoại</th>
          <th v-if="checkPermission([18,19,20])"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(car,index) in cars" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ car['licensePlate'] }}</td>
          <td><a :href="`tel:${ car['phoneNumber']}`">{{ car['phoneNumber'] }}</a></td>
          <td v-if="checkPermission([18,19,20])">
            <router-link :to="{ name: 'ChiTietChiPhi', params: { id:car.id, licensePlate:car.licensePlate}}" class="router-link">
            Xem
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
      @change="getCarOfWareHouse"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from '../../../store/BaseRequest'

export default {
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.getCarOfWareHouse(1);
  },
  data(){
    return {
      Garage: null,
      cars: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false,
      user: {},
      permissionIds: []
    }
  },
  methods:{
    getCarOfWareHouse(page) {
      this.loading = true;
      BaseRequest.get('/car-of-ware-house?per_page=' + this.perPage, {page})
      .then(response => {
        this.loading = false;
        this.cars = response.data.data
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
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
  background-color: #28a745;
  border-color: #28a745;
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
	td:nth-of-type(2):before { content: "Biển số xe"; }
	td:nth-of-type(3):before { content: "Số điện thoại"; }
	td:nth-of-type(4):before { content: ""; }
}
</style>