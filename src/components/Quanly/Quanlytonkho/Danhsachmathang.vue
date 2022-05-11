<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Mặt hàng tồn kho</h2>
    <div class="d-flex px-2 pt-3 mb-2">
      <div>
        <b-form-datepicker id="start_day" v-model="confirmDay"  class="mb-2" 
        locale="vi" placeholder="Lọc theo ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
        label-close-button="Đóng" close-button @input="getInventory(1)">
        </b-form-datepicker>
      </div>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>SĐT người nhận</th>
          <th>Địa chỉ người nhận</th>
          <th>Ngày nhận</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listGoods" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.quantity}} {{item.unit}}</td>
          <td><a :href="`tel:${item.order.phoneReceiver}`">{{item.order.phoneReceiver}}</a></td>
          <td>{{item.order.addressReceiver}}</td>
          <td>{{item.confirmDay | moment }}</td>
          <td>
            <router-link :to="{ name: 'Thongtindonhang',params: {id:item.id}}" class="router-link">
              Xem đơn hàng
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
  </div>
</template>

<script>
import BaseRequest from '../../../store/BaseRequest'
import moment from 'moment'
export default {
  created() {
    this.getInventory(1);
  },
  data() {
    return {
      listGoods:null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      confirmDay: '',
      loading: false
    }
  },
  watch: {
    currentPage() {
      if(this.date != null){
        this.getInventory()
      }
      else {
        this.getInventory()
      }
    }
  },
  methods: {
    getInventory() {
      this.loading = true;
    BaseRequest.get('/get-inventory?per_page=' + this.perPage + "&date=" + this.confirmDay, {page: this.currentPage})
    .then(response => {
      this.loading = false;
      this.listGoods = response.data.data
      this.currentPage = response.data.current_page;
      this.rows = response.data.total;
    })
    },
    moment() {
    return moment();
    },
     hasHistory () { return window.history.length > 2 }
  },
  filters: {
    moment: function (date) {
    return moment(date).format('D/MM/YYYY');
    }
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
	td:nth-of-type(2):before { content: "Tên mặt hàng"; }
	td:nth-of-type(3):before { content: "Số lượng"; }
	td:nth-of-type(4):before { content: "SĐT người nhận"; }
	td:nth-of-type(5):before { content: "Địa chỉ người nhận"; }
	td:nth-of-type(6):before { content: "Ngày nhận"; }
  td:nth-of-type(7):before { content: ""; }
}
</style>