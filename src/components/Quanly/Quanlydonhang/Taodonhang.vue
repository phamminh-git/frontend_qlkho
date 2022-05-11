<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Tạo đơn hàng</h2>
    <br />
    <div class="alert alert-success" v-if="createSuccess">Tạo đơn hàng thành công</div>
    <form @submit.prevent="createOrder()" class="px-3">
      <div class="row align-items-center mt-1">
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Tên người gửi"
            v-model="order.nameSender"
          />
          <div class="text-danger" align="start" v-if="errorMessage.nameSender" @change="errorMessage.nameSender=null">{{errorMessage.nameSender[0]}}</div>
        </div>
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Địa chỉ người gửi"
            v-model="order.addressSender"
          />
          <div class="text-danger" align="start" v-if="errorMessage.addressSender" @change="errorMessage.addressSender=null">{{errorMessage.addressSender[0]}}</div>
        </div>
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Số điện thoại người gửi"
            v-model="order.phoneSender"
          />
          <div class="text-danger" align="start" v-if="errorMessage.phoneSender" @change="errorMessage.addressSender=null">{{errorMessage.phoneSender[0]}}</div>
        </div>
      </div>
      <div class="row align-items-center mt-4">
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Tên người nhận"
            v-model="order.nameReceiver"
          />
          <div class="text-danger" align="start" v-if="errorMessage.nameReceiver" @change="errorMessage.nameReceiver=null">{{errorMessage.nameReceiver[0]}}</div>
        </div>
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Địa chỉ người nhận"
            v-model="order.addressReceiver"
          />
          <div class="text-danger" align="start" v-if="errorMessage.addressReceiver" @change="errorMessage.addressReceiver=null">{{errorMessage.addressReceiver[0]}}</div>
        </div>
        <div class="col-md-4 col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Số điện thoại người nhận"
            v-model="order.phoneReceiver"
          />
          <div class="text-danger" align="start" v-if="errorMessage.phoneReceiver" @change="errorMessage.phoneReceiver=null">{{ errorMessage.phoneReceiver[0] }}</div>
        </div>
      </div>
      <!-- =================Goods============ -->
      <br />
      <!-- <goods /> -->
      <div style="width: 100%; border-bottom: 2px solid rgba(0,0,0,.1);" class="text-start">
        <span style="font-size: 20px; background-color: #F3F5F6; font-weight: bold;">Mặt hàng</span>
      </div>
      <div class="text-danger" align="center" 
      v-if="errorMessage['goods.0.name'] || 
      errorMessage['goods.0.fare'] || 
      errorMessage['goods.0.quantity'] ||
      errorMessage['goods.0.unit']
      ">
      Vui lòng nhập đầy đủ thông tin mặt hàng</div>
      <div v-for="(itemGoods, index) in order.goods" :key="index" class="row align-items-center mt-4">
        <div class="col-md col-12 my-2 my-md-0 ">
        <input
          type="text"
          class="form-control py-4"
          placeholder="Tên mặt hàng"
          v-model="itemGoods.name"
        />
        </div>
        <div class="col-md col-12 my-2 my-md-0">
          <input
            type="number"
            class="form-control py-4"
            placeholder="Số lượng"
            v-model="itemGoods.quantity"
          />
        </div>
        <div class="col-md col-12 my-2 my-md-0">
          <input
            type="text"
            class="form-control py-4"
            placeholder="Đơn vị"
            v-model="itemGoods.unit"
          />
        </div>
        <div class="col-md col-12 my-2 my-md-0">
          <input
            type="number"
            class="form-control py-4"
            placeholder="Tiền thu hộ"
            v-model="itemGoods.collectedMoney"
          />
        </div>
        <div class="col-md col-12 my-2 my-md-0">
          <input type="number" class="form-control py-4" placeholder="Tiền thu khách" v-model="itemGoods.fare" />
        </div>
        <div class="col-md-2 col-12 my-2 my-md-0">
          <button type="button" class="btn btn-danger" align="center" @click="removeGoods(index)">Xoá hàng</button>
        </div>
      </div>
      <div class="pt-3 pb-4 text-start">
        <button type ="button" class="btn btn-success btn-sm" @click="addGoods">Thêm hàng</button>
      </div>
      <div class="row">
        <div class="col-12 mx-auto">
          <button type="submit" class="btn btn-primary" align="center">Tạo đơn hàng</button>
        </div>
      </div>
    </form>
    <!-- </b-modal> -->
  </div>
</template>

<script>
import BaseRequest from "../../../store/BaseRequest";

export default {
  data() {
    return {
      createSuccess: false,
      order: {
        phoneSender: null,
        addressSender: null,
        nameSender: null,
        nameReceiver: null,
        phoneReceiver: null,
        addressReceiver: null,
        goods: [
          {
            name: null,
            quantity: null,
            unit: null,
            collectedMoney: null,
            fare: null
          }
        ]
      },
      errorMessage: {
        phoneSender: null,
        addressSender: null,
        nameSender: null,
        nameReceiver: null,
        phoneReceiver: null,
        addressReceiver: null,
      },
    };
  },
  methods: {
    createOrder() {
      BaseRequest.post("/order", this.order)
      .then(() => {
        setTimeout(()=> {
          this.createSuccess = false;
        },2000)
          this.createSuccess = true;
          this.order.nameSender = null
          this.order.addressSender = null
          this.order.phoneSender = null
          this.order.nameReceiver = null
          this.order.addressReceiver = null
          this.order.phoneReceiver = null
          this.order.goods = [
            {
              name: null,
              quantity: null,
              unit: null,
              collectedMoney: null,
              fare: null
            }
          ]
      })
      .catch(error=> {
        this.errorMessage = error.response.data.errors;
      })
    },
    addGoods() {
      const newOrder = { ...this.order };
      newOrder.goods.push({
        name: null,
        quantity: null,
        unit: null,
        collectedMoney: null,
        fare: null
      });
      this.order = newOrder;
    },
    removeGoods(index) {
      const newOrder = { ...this.order };
      newOrder.goods.splice(index, 1);
      this.order = newOrder;
    },
     hasHistory () { return window.history.length > 2 }
  }
};
</script>

<style scoped>
.px-5 {
  padding-right: 12.6rem !important;
  padding-left: 12.6rem !important;
}
.router-link {
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
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.text-start {
  text-align: center !important;
}
</style>