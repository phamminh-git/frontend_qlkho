<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Tiền thu hộ đã thanh toán</h2>
    <div class="alert alert-success" v-if="confirmSuccess">Hủy thanh toán thành công</div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên người gửi</th>
          <th>Địa chỉ người gửi</th>
          <th>Số điện thoại người gửi</th>
          <th>Tên người nhận</th>
          <th>Địa chỉ người nhận</th>
          <th>Số điện thoại người nhận</th>
          <th>Tổng tiền nhận</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(orderconfirmpays, index) in orderconfirmpays" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{orderconfirmpays['nameSender']}}</td>
          <td>{{orderconfirmpays['addressSender']}}</td>
          <td><a :href="`tel:${orderconfirmpays['phoneSender']}`">{{orderconfirmpays['phoneSender']}}</a></td>
          <td>{{orderconfirmpays['nameReceiver']}}</td>
          <td>{{orderconfirmpays['addressReceiver']}}</td>
          <td><a :href="`tel:${orderconfirmpays['phoneReceiver']}`">{{orderconfirmpays['phoneReceiver']}}</a></td>
          <td>{{orderconfirmpays['total_collected_money'] | baonhieutien | dinhdangtien | vietnamDong}}</td>
          <td class="features">
            <b-button class="btn-sm delete" @click="showConfirmModal(orderconfirmpays.id)" variant="danger">Hủy</b-button>
            <b-button class="btn-sm" @click="showorder(orderconfirmpays.id)" variant="primary">Xem mặt hàng</b-button>
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
      @change="getlistOrder"
      ></b-pagination>
    </div>
    <b-modal title="Thanh toán" ref="confirm-modal" hide-footer>
      <p class="mb-4">Hủy thanh toán cho khách hàng</p>
      <div class="text-end">
        <b-button variant="danger" class="btn-sm" @click="hideConfirmModal()">Hủy bỏ</b-button>
        <b-button variant="success" class="mx-2 btn-sm" @click="handleConfirm">Đồng ý</b-button>
      </div>
    </b-modal>
    <b-modal size="lg" v-model="showinfo" title="Thông tin chi tiết" v-bind:hide-footer="true">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên mặt hàng</th>
            <th>Số lượng</th>
            <th>Tiền thu hộ</th>
            <th>Phí</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in inforOrder.goods" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.quantity}} {{item.unit}}</td>
            <td>{{item.collectedMoney | baonhieutien | dinhdangtien | vietnamDong}}</td> 
            <td>{{item.fare | baonhieutien | dinhdangtien | vietnamDong}}</td>
            <td class="text-success">{{item.status=="received"?"Đã nhận":item.status=="not_received"?"Chưa nhận":item.status=="delivered"?"Đã giao":""}}</td>
          </tr>
        </tbody>
      </table>
    </b-modal>
  </div>
</template>
<script>
import BaseRequest from '../../../store/BaseRequest'
export default {
  created: function(){
    this.getlistOrder(1)
  },
  filters: {
    baonhieutien(sotien){
      if(sotien == 0){
        return 0
      }else{
        return sotien
      }
    },
    vietnamDong(sotien){
      return sotien + ' VND'
    },
    dinhdangtien(sotien){
      return sotien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  data(){
    return{
      orderconfirmpays: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false,
      inforOrder: {},
      showinfo: false,
      confirmSuccess: false,
    }
  },
  methods: {
    getlistOrder: function(page){
      this.loading = true;
      BaseRequest.get('/admin/order-confirm-pay?per_page=' + this.perPage, {page})
      .then( response => {
        this.loading = false;
        this.orderconfirmpays = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    showorder: function(id){
      this.showinfo = true;
      BaseRequest.get('/order/' + id)
      .then(response => {
        this.inforOrder = response.data
      })
    },
    showConfirmModal(id) {
      this.order_id = id;
      this.$refs['confirm-modal'].show();
    },
    hideConfirmModal() {
      this.$refs['confirm-modal'].hide();
    },
    handleConfirm (){
      BaseRequest.put('/admin/confirm-pay-customer/' + this.order_id)
      .then(() => {
        this.$refs["confirm-modal"].hide();
        setTimeout(() => {
          this.confirmSuccess = false;
        }, 1000);
        this.confirmSuccess = true;
        this.getlistOrder();
      })
      .catch( () => {
      })
    },
    hasHistory () { return window.history.length > 2 }
  }
}
</script>

<style scoped>
.features{
  display: flex;
}
.delete{
  margin-right: 5px;
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
  .features{
    display: block;
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
	td:nth-of-type(2):before { content: "Tên người gửi"; }
	td:nth-of-type(3):before { content: "Địa chỉ người gửi"; }
	td:nth-of-type(4):before { content: "Số điện thoại người gửi"; }
	td:nth-of-type(5):before { content: "Tên người nhận"; }
  td:nth-of-type(6):before { content: "Địa chỉ người nhận"; }
	td:nth-of-type(7):before { content: "Số điện thoại người nhận"; }
	td:nth-of-type(8):before { content: "Tổng tiền nhận"; }
  td:nth-of-type(9):before { content: ""; }
}
</style>