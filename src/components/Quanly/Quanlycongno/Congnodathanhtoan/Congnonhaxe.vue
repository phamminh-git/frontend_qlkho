<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Danh sách nhà xe</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên nhà xe</th>
          <th>Số điện thoại</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(getGarage, index) in getGarages" :key="(getGarage.id,index)">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{getGarage['name']}}</td>
          <td><a :href="`tel:${getGarage['phoneNumber']}`">{{getGarage['phoneNumber']}}</a></td>
          <td>
            <router-link :to="{ path: '/dashboardadmin/congnodathanhtoan/congnonhaxe/congnocacxe/' + getGarage['id']}" class="router-link">
            Danh sách các xe
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
      @change="getlistGarage"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'
export default {
  created: function(){
    this.getlistGarage(1)
  },
  data(){
    return {
      getGarages: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false
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
	td:nth-of-type(2):before { content: "Tên nhà xe"; }
	td:nth-of-type(3):before { content: "Số điện thoại"; }
	td:nth-of-type(4):before { content: "Công nợ"; }
	td:nth-of-type(5):before { 
    top: 20px;
    content: ""; }
}
</style>