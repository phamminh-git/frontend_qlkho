<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Hàng đang trên xe</h2>
    <div class="text-start px-2 pt-4 mb-3">
      <form class="locngayxep">
        <b-form-datepicker id="start_day" v-model="loadCarDay"
          locale="vi" placeholder="Chọn ngày xếp lên xe" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
          label-close-button="Đóng" close-button @input="search">
        </b-form-datepicker>
      </form>
      <div class="d-flex justify-content-between">
        <div class="">
          <input type="text" class="form-control" placeholder="Nhập biển số xe" v-model="loadCar" v-debounce:300ms="search"/>
        </div>
      </div>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>Tiền thu hộ</th>
          <th>Phí</th>
          <th>Ngày xếp hàng</th>
          <th>Biển số xe</th>
          <th>Cước xe</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in goodsInCar" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.quantity}} {{item.unit}}</td>
          <td>{{item.collectedMoney | convertVND}}</td>
          <td>{{item.fare | convertVND}}</td>
          <td>{{item.loadCarDay | moment}}</td>
          <td>{{item.car.licensePlate }}</td>
          <td>{{item.fareOfCar | convertVND}}</td>
          <td>
            <router-link
            :to="{ name: 'Chitietdonhang', params: { id:item.id}}"
            class="router-link"
            >Xem hàng
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <div class="d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="rows"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from "../../../store/BaseRequest";
import moment from "moment";

export default {
  props: ["id"],
  created: function() {
    this.getListCar(1);
  },
  data() {
    return {
      loadCarDay: '',
      loadCar: '',
      goodsInCar: null,
      currentPage: 1,
      perPage: 40,
      rows: 2,
      loading: false,
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("D/MM/YYYY");
    },
    convertVND(money) {
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    }
  },
  watch: {
    currentPage: function(){
      if(this.loadCar != null || this.loadCarDay){
        this.search()
      }
      else {
        this.getListCar()
      }
    }
  },
  methods: {
    getListCar() {
      this.loading = true;
      BaseRequest.get(`/goods-in-car/?&per_page=${this.perPage}`,{ page:this.currentPage })
      .then(response => {
        this.loading = false;
        this.goodsInCar = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      });
    },
    search() {
        this.loading = true;
      BaseRequest.get(`/goods-in-car/?day=${this.loadCarDay}&license_plate=${this.loadCar}&per_page=${this.perPage}`,{ page:this.currentPage })
      .then(response => {
        this.loading = false;
        this.goodsInCar = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      });
    },
    moment: function() {
      return moment();
    },
     hasHistory () { return window.history.length > 2 }
  }
};
</script>

<style scoped>
.router-link {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  margin-left: 0;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.fa-chevron-left:before { 
  vertical-align: middle;
}
.form-control{
  margin-right: 10px;
}
.text-start{
  display: flex;
  justify-content: space-between;
}
/* .locngayxep{
  display: flex;
} */
.mb-2 {
  margin-bottom: 0rem !important;
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
	td:nth-of-type(4):before { content: "Tiền thu hộ"; }
	td:nth-of-type(5):before { content: "Phí"; }
	td:nth-of-type(6):before { content: "Ngày xếp hàng"; }
  td:nth-of-type(7):before { content: "Biển số xe"; }
	td:nth-of-type(8):before { content: "Cước xe"; }
	td:nth-of-type(9):before { content: ""; }
}
</style>