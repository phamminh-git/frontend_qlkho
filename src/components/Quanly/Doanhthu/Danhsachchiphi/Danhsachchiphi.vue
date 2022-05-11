<template>
  <div>
    <h2>Danh sách chi phí</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered mt-3" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Biển số xe</th>
          <th>Số điện thoại</th>
          <th>Ngày di chuyển</th>
          <th>Chi phí</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listCost" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ item.car.licensePlate }}</td>
          <td><a :href="`tel:${ item.car.phoneNumber }`">{{ item.car.phoneNumber }}</a></td>
          <td>{{ item.car.date | moment }}</td>
          <td>{{ item.cost | dinhdangtien | vietnamDong }}</td>

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
      @change="getlistCost"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from '../../../../store/BaseRequest'
import moment from 'moment'
export default {
  props: ['start', 'end'],
  created: function(){
    this.getlistCost(1)
  },
  filters:{
    vietnamDong(sotien){
      return sotien + ' VND'
    },
    dinhdangtien(sotien){
      return sotien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    moment: function (date) {
    return moment(date).format('D/MM/YYYY');
    }
  },
  data(){
    return{
      listCost: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false
    }
  },
  methods: {
    getlistCost: function(page){
      this.loading = true;
      BaseRequest.get('/admin/stat-costs-of-car?start_day=' + this.$route.query.start + '&end_day=' + this.$route.query.end + '&per_page=' + this.perPage, {page} )
      .then( response => {
        this.loading = false;
        this.listCost = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    moment: function () {
      return moment();
    }
  }
}
</script>

<style scoped>
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
	td:nth-of-type(4):before { content: "Ngày di chuyển"; }
	td:nth-of-type(5):before { content: "Chi phí"; }
}
</style>