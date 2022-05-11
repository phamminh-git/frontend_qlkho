<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Danh sách mặt hàng ({{$route.query.licensePlate}})</h2>
    <div class="alert alert-success" v-if="cancelSuccess">Huỷ nhận tiền thu hộ của mặt hàng thành công</div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Mặt hàng</th>
          <th>Số lượng</th>
          <th>Tiền thu hộ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(good,index) in goods" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{good['name']}}</td>
          <td>{{good['quantity']}} {{good['unit']}}</td>
          <td>{{good['collectedMoney'] | dinhdangtien | vietnamDong}}</td>
          <td>
            <b-button variant="danger" class="btn-sm" @click="showCancelModal(good.id)">Huỷ</b-button>
            <router-link
              :to="{ name: 'Thongtindonhang', params: { id:good.id}}"
              class="router-link mx-2"
              >Xem đơn hàng
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center">
      <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      @change="getlistGoods"
      ></b-pagination>
    </div>
    <!-- !-- =========confirm modal========= -->
    <b-modal title="Huỷ xác nhận" ref="cancel-modal" hide-footer>
      <div class="text-end">
        <b-button variant="danger" class="mx-2 btn-sm" @click="hideCancelModal">Huỷ bỏ</b-button>
        <b-button variant="success"  class="btn-sm" @click="handleCancel()">Xác nhận</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'

export default {
  props: ['id'],
  created: function(){
    this.getlistGoods(1)
  },
  filters: {
    vietnamDong(sotien){
      return sotien + ' VND'
    },
    dinhdangtien(sotien){
      return sotien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  },
  data(){
    return {
      goods: null,
      cancelSuccess: false,
      good_id: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false
    }
  },
  methods: {
    getlistGoods(page) {
      this.loading = true;
      BaseRequest.get('/get-goods-pay-ware-house/' + this.id + '?per_page=' + this.perPage, {page})
      .then( response => {
        this.loading = false;
        this.goods = response.data.data
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    showCancelModal: function(id){
      this.$refs['cancel-modal'].show()
      this.good_id = id;
    },
    hideCancelModal() {
      this.$refs['cancel-modal'].hide()
    },
    handleCancel() {
      BaseRequest.put('/cancel_confirm-collected-money-from-car/' + this.good_id)
      .then( () => {
        this.$refs["cancel-modal"].hide();
        setTimeout(() => {
          this.cancelSuccess = false;
        }, 1000);
        this.cancelSuccess = true;
        this.getlistGoods();
      })
    },
    hasHistory () { return window.history.length > 2 }
  }
}
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
	td:nth-of-type(2):before { content: "Mặt hàng"; }
	td:nth-of-type(3):before { content: "Số lượng"; }
	td:nth-of-type(4):before { content: "Tiền thu hộ"; }
  td:nth-of-type(5):before { 
    top: 20px;
    content: ""; }
}
</style>