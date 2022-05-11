<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Chi tiết đơn hàng</h2>
    <div class="row mb-4" v-if="!loading">
      <ul class="list-group col">
        <li class="list-group-item"><strong>Người gửi</strong></li>
        <li class="list-group-item">{{inforOrder.nameSender}}</li>
        <li class="list-group-item">{{inforOrder.addressSender}}</li>
        <li class="list-group-item">{{inforOrder.phoneSender}}</li>
      </ul>
      <ul class="list-group col">
        <li class="list-group-item"><strong>Người nhận</strong></li>
        <li class="list-group-item">{{inforOrder.nameReceiver}}</li>
        <li class="list-group-item">{{inforOrder.addressReceiver}}</li>
        <li class="list-group-item">{{inforOrder.phoneReceiver}}</li>
      </ul>
    </div>
    <h5 class="text-start ms-2">Thông tin mặt hàng</h5>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>Tiền thu hộ</th>
          <th>Phí</th>
          <th>Xe vận chuyển</th>
          <th>Chi phí gửi xe</th>
        </tr>
      </thead>
      <tbody>
         <tr v-for="(item,index) in inforOrder.goods" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.quantity}} {{item.unit}}</td>
          <td>{{item.collectedMoney | convertVND}}</td> 
          <td>{{item.fare | convertVND}}</td>
          <td class="text-success">{{item.car!=null?item.car.licensePlate:"Chưa xếp lên xe"}}</td> 
          <td>{{item.fareOfCar | convertVND}}</td> 
        </tr>
      </tbody>
    </table>
    <br>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'

export default {
  props: ['id'],
  created: function() {
    this.loading = true;
    this.goodsDetail()
  },
  data() {
    return {
      inforOrder: {},
      orderId:'',
      loading:false,
    };
  },
  methods: {
    goodsDetail() {
      BaseRequest.get('/order/' + this.id)
      .then(response => {
        this.loading = false;
        this.inforOrder = response.data;
      })
    },
     hasHistory () { return window.history.length > 2 }
  },
  filters: {
    convertVND(money){
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    }
  },
};
</script>

<style scoped>
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tr {
    border: 1px solid #ccc;
  }
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
  td:nth-of-type(1):before {
    content: "STT";
  }
  td:nth-of-type(2):before {
    content: "Tên mặt hàng";
  }
  td:nth-of-type(3):before {
    content: "Số lượng";
  }
  td:nth-of-type(4):before {
    content: "Tiền thu hộ";
  }
  td:nth-of-type(5):before {
    content: "Phí";
  }
  td:nth-of-type(6):before {
    content: "Xe vận chuyển";
  }
  td:nth-of-type(7):before {
    content: "Chi phí gửi xe";
  }
}
</style>