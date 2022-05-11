<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2 v-if="Garage !== null">{{ Garage['name'] }}</h2>
    <h3 v-if="Garage !== null">{{ Garage['phoneNumber'] }}</h3>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Biển số xe</th>
          <th>Số điện thoại</th>
          <th>Lộ trình</th>
          <th>Công nợ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(car,index) in cars" :key="(car.id, index)">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ car['licensePlate'] }}</td>
          <td>{{ car['phoneNumber'] }}</td>
          <td>{{ car['route'] }}</td>
          <td>{{ car['totalDebt'] | soTien | dinhdangtien | vietnamDong }}</td>
          <td>
            <router-link :to="{ name: 'Xacnhantienthuhochuathanhtoan', params: { id:car.id }, query: { licensePlate: car.licensePlate}}" class="router-link">
              Danh sách mặt hàng
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
      @change="getlistCar"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'

export default {
  props: ['id'],
  created: function(){
    this.getlistCar(1)
  },
  filters: {
    vietnamDong(sotien){
      return sotien + ' VND'
    },
    dinhdangtien(sotien){
      return sotien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    soTien(sotien){
      if (sotien == null){
        return '0'
      }else{
        return sotien
      }
    }
  },
  data(){
    return {
      Garage: null,
      cars: null,
      Garage_id: this.id,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false
    }
  },
  methods: {
    getlistCar: function(page){
      this.loading =true;
      BaseRequest.get('/carrental/' + this.id)
      .then(response => {
        this.loading =false;
        this.Garage = response.data
        BaseRequest.get('/car?carrental_id=' + this.id + '&per_page=' + this.perPage, {page})
        .then(response => {
          this.cars = response.data.data
          this.currentPage = response.data.current_page;
          this.rows = response.data.total;
        })
      }) 
    },
     hasHistory () { return window.history.length > 2 }
  }
}
</script>

<style scoped>
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
	td:nth-of-type(4):before { 
    top: 1px;
    content: "Lộ trình"; }
	td:nth-of-type(5):before { content: "Công nợ"; }
  td:nth-of-type(6):before { 
    top: 20px;
    content: ""; }
}
</style>