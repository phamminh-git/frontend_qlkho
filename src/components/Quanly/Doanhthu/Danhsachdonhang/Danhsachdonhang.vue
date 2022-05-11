<template>
  <div>
    <h2>Danh sách đơn hàng</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered mt-3" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên người gửi</th>
          <th>Địa chỉ người gửi</th>
          <th>Số ĐT người gửi</th>
          <th>Tên người nhận</th>
          <th>Địa chỉ người nhận</th>
          <th>Số ĐT người nhận</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listOrder" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{item.nameSender}}</td>
          <td>{{item.addressSender}}</td>
          <td><a :href="`tel:${item.phoneSender}`">{{item.phoneSender}}</a></td>
          <td>{{item.nameReceiver}}</td>
          <td>{{item.addressReceiver}}</td>
          <td><a :href="`tel:${item.phoneReceiver}`">{{item.phoneReceiver}}</a></td>
          <td>
            <b-button @click="sendid(item.id)" variant="primary">Danh sách mặt hàng</b-button>
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
      @change="getlistOrder"
      ></b-pagination>
    </div>
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
            <td>{{item.collectedMoney | convertVND}}</td> 
            <td>{{item.fare | convertVND}}</td>
            <td class="text-success">{{item.status=="received"?"Đã nhận":item.status=="not_received"?"Chưa nhận":item.status=="delivered"?"Đã giao":""}}</td>
          </tr>
        </tbody>
      </table>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from '../../../../store/BaseRequest'
export default {
  props: ['start', 'end'],
  created: function(){
    this.getlistOrder(1)
  },
  filters: {
    convertVND(money){
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    }
  },
  data(){
    return{
      listOrder: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      showinfo: false,
      inforOrder: {},
      loading:false
    }
  },
  methods: {
    getlistOrder: function(page){
      this.loading = true;
      BaseRequest.get('/admin/stat-order?start_day=' + this.$route.query.start + '&end_day=' + this.$route.query.end + '&per_page=' + this.perPage, {page} )
      .then( response => {
        this.loading = false;
        this.listOrder = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      })
    },
    sendid: function(id){
      this.showinfo = true;
      BaseRequest.get('/order/' + id)
      .then(response => {
        this.inforOrder = response.data
      })
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
	td:nth-of-type(2):before { content: "Tên người gửi"; }
	td:nth-of-type(3):before { content: "Địa chỉ người gửi"; }
	td:nth-of-type(4):before { content: "Số ĐT người gửi"; }
	td:nth-of-type(5):before { content: "Tên người nhận"; }
  td:nth-of-type(6):before { content: "Địa chỉ người nhận"; }
	td:nth-of-type(7):before { content: "Số ĐT người nhận"; }
  td:nth-of-type(8):before { 
    top: 20px;
    content: ""; }
}
</style>