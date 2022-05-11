<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Chi tiết đơn hàng đã nhận</h2>
    <b-alert variant="success" :show="dismissCountDown" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged" dismissible>
      Huỷ xác nhận mặt hàng thành công
    </b-alert>
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
    <h5 class="text-start mb-2 ms-3">Thông tin mặt hàng</h5>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>Tiền thu hộ</th>
          <th>Phí</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
         <tr v-for="(item,index) in inforOrder.goods" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.quantity}} {{item.unit}}</td>
          <td>{{item.collectedMoney | convertVND}}</td> 
          <td>{{item.fare | convertVND}}</td>
          <td class="text-success">{{item.confirmDay!=null?"Đã nhận":item.car_id==null?"Chưa nhận":"Đã giao"}}</td>
          <td>
            <b-button variant="danger" v-if="item.confirmDay!=null" @click.prevent="itemId = item.id" v-b-modal.modalPopover class="btn-sm">Hủy mặt hàng</b-button>
          </td>
        </tr>
        <b-modal id="modalPopover" title="Hủy xác nhận mặt hàng" hide-footer >
          <div class="d-flex justify-content-end">
            <b-button size="sm" variant="danger" @click="$bvModal.hide('modalPopover')" class="modal-btn mx-2">Hủy bỏ</b-button>
            <b-button size="sm" variant="primary" @click="cancelConfirmOrder(); $bvModal.hide('modalPopover')" class="modal-btn text-end">Đồng ý</b-button>						
          </div>	
        </b-modal>
      </tbody>
    </table>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'

export default {
  props: ['id'],
  created: function() {
    this.getOrder();
  },
  data() {
    return {
      inforOrder: {},
      loading:false,
      itemId: 0,
      dismissCountDown: 0,
      dismissSecs: 3,
    };
  },
  filters: {
    convertVND(money){
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    }
  },
  methods: {
    getOrder() {
    this.loading = true;
    BaseRequest.get('/order/' + this.id)
    .then(response => {
      this.loading = false;
      this.inforOrder = response.data;
    })
    },
    cancelConfirmOrder: function() {
      console.log(this.itemId);
      BaseRequest.put('/goods/cancel-confirm/' + this.itemId)
      .then( () => {
        this.dismissCountDown = this.dismissSecs;
        this.getOrder();
      })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    hasHistory () { return window.history.length > 2 }
  }
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
}
</style>