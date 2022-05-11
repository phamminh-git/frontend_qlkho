<template>
  <div>
    <h2>Danh sách mặt hàng xếp lên xe</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Ngày xếp lên xe</th>
          <th>Tên người gửi</th>
          <th>SĐT người gửi</th>
          <th>Biển số xe</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listOrderincar" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }} {{ item.unit }}</td>
          <td>{{ item.fareOfCar | dinhdangtien | vietnamDong}}</td>
          <td>{{ item.loadCarDay | moment }}</td>
          <td>{{item.order.nameSender}}</td>
          <td><a :href="`tel:${item.order.phoneSender}`">{{item.order.phoneSender}}</a></td>
          <td>{{item.car.licensePlate}}</td>
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
      @change="getlistOrderincar"
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
    this.getlistOrderincar(1)
  },
  data(){
    return{
      listOrderincar: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      Car: null,
      showinfocar: false,
      showinfo: false,
      loading:false
    }
  },
  filters:{
    lotrinh(route){
      if(route == null){
        return 'Chưa có'
      }
    },
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
  methods: {
    getlistOrderincar: function(page){
      this.loading = true;
      BaseRequest.get('/admin/stat-fare-of-car?start_day=' + this.$route.query.start + '&end_day=' + this.$route.query.end + '&per_page=' + this.perPage, {page} )
      .then( response => {
        this.loading = false;
        this.listOrderincar = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
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
	td:nth-of-type(2):before { content: "Tên mặt hàng"; }
	td:nth-of-type(3):before { content: "Số lượng"; }
	td:nth-of-type(4):before { content: "Giá"; }
	td:nth-of-type(5):before { content: "Ngày xếp lên xe"; }
  td:nth-of-type(6):before { content: "Tên người gửi"; }
  td:nth-of-type(7):before { content: "SĐT người gửi"; }
  td:nth-of-type(8):before { content: "Biển số xe"; }
}
</style>