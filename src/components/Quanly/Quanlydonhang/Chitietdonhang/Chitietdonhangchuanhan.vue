<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Chi tiết đơn hàng chưa nhận</h2>
    <div class="alert alert-success" v-if="fixSuccess">Sửa mặt hàng thành công</div>
    <div class="alert alert-success" v-if="removeSuccess">Xoá mặt hàng thành công</div>
    <div class="alert alert-success" v-if="addSuccess">Thêm mặt hàng thành công</div>
    <h5 class="text-end me-3">Ngày tạo: {{inforOrder.created_at | moment}}</h5>
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
    <div class="d-flex justify-content-between mb-3">
      <h5 class="text-start mb-2 ms-3">Thông tin mặt hàng</h5>
      <button class="btn btn-primary me-3 btn-sm" align="center" @click="showAddModal()" v-if="checkPermission([4])">Thêm hàng</button>
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
          <th>Trạng thái</th>
          <th v-if="checkPermission([5,6])"></th>
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
          <td v-if="checkPermission([5,6]) && item.confirmDay==null">
            <button
              class="btn btn-success mx-3 btn-sm"
              align="center"
              v-b-modal.modal-1
              @click="showItemGoods(item.id)"
              v-if="item.confirmDay==null && checkPermission([5])"
            >Sửa</button>
            <button class="btn btn-danger btn-sm" align="center" v-if="item.confirmDay==null && checkPermission([6])" @click="showDeleteModal(item.id)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- ==========================modal3 add item goods===================== -->
    <b-modal id="modal-4" title="Thêm mặt hàng" :hide-footer="true" ref="my-modal3" size="lg">
      <form action @submit.prevent="addItemGoods">
        <div class="row align-items-center mt-3">
          <div class="col-md-2 col-12">
            <label for="start">Tên mặt hàng:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" class="form-control" placeholder="Tên mặt hàng" v-model="itemGoods.name" @change="errorMessage.name = null"/>
          </div>
        </div>
        <div class=" text-center text-danger" v-if="errorMessage.name">{{errorMessage.name[0]}}</div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Số lượng:</label>
          </div>
          <div class="col-md-7 col-12 mb-md-0 mb-2">
            <input type="number" class="form-control" placeholder="Số lượng" v-model="itemGoods.quantity" @change="errorMessage.quantity = null"/>
            <div class=" text-danger text-center" v-if="errorMessage.quantity">{{errorMessage.quantity[0]}}</div>
          </div>
          <div class="col-md-3 col-12">
            <input type="text" class="form-control" placeholder="Đơn vị" v-model="itemGoods.unit" @change="errorMessage.unit = null"/>
            <div class=" text-danger text-center" v-if="errorMessage.unit">Chưa nhập đơn vị</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Tiền thu hộ:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="number" class="form-control" placeholder="Tiền thu hộ" v-model="itemGoods.collectedMoney" @change="errorMessage.collectedMoney = null"/>
          </div>
        </div>
        <div class="text-center text-danger" 
        v-if="errorMessage.collectedMoney"
        >{{errorMessage.collectedMoney[0]}}</div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Phí:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="number" class="form-control" placeholder="Phí" v-model="itemGoods.fare" @change="errorMessage.fare = null"/>
          </div>
        </div>
        <div class="text-center text-danger" v-if="errorMessage.fare">{{errorMessage.fare[0]}}</div>
        <div class="text-center py-2 mt-4">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Thêm mặt hàng</button>
        </div>
      </form>
    </b-modal>
    <!-- ====================Modal update item goods====================== -->
    <b-modal id="modal-1" title="Sửa thông tin mặt hàng" :hide-footer="true" ref="my-modal" size="lg">
      <form action @submit.prevent="updateItemGoods(itemGoods.id)">
        <div class="row align-items-center mt-3">
          <div class="col-md-2 col-12">
            <label for="start">Tên mặt hàng:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" class="form-control" v-model="itemGoods.name" @change="errorMessage.name = null"/>
          </div>
        </div>
        <div class=" text-center text-danger" v-if="errorMessage.name">{{errorMessage.name[0]}}</div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Số lượng:</label>
          </div>
          <div class="col-md-7 col-12 mb-md-0 mb-2">
            <input type="number" class="form-control" v-model="itemGoods.quantity" @change="errorMessage.quantity = null"/>
            <div class=" text-danger text-center" v-if="errorMessage.quantity">{{errorMessage.quantity[0]}}</div>
          </div>
          <div class="col-md-3 col-12">
            <input type="text" class="form-control" placeholder="Đơn vị" v-model="itemGoods.unit" @change="errorMessage.unit = null"/>
            <div class=" text-danger text-center" v-if="errorMessage.unit">Chưa nhập đơn vị</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Tiền thu hộ:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="number" class="form-control" v-model="itemGoods.collectedMoney" @change="errorMessage.collectedMoney = null"/>
          </div>
        </div>
        <div class="text-center text-danger" 
        v-if="errorMessage.collectedMoney"
        >{{errorMessage.collectedMoney[0]}}</div>
        <div class="row align-items-center mt-4">
          <div class="col-md-2 col-12">
            <label for="start">Phí:</label>
          </div>
          <div class="col-md-10 col-12">
            <input type="number" class="form-control" v-model="itemGoods.fare" @change="errorMessage.fare = null"/>
          </div>
        </div>
        <div class="text-center text-danger" v-if="errorMessage.fare">{{errorMessage.fare[0]}}</div>
        <div class="text-center py-2 mt-4">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <!-- ========================Modal delete confirmation=========================== -->
    <b-modal title="Xoá" ref="my-modal2" hide-footer>
      <p class="mb-4">Bạn có chắc chắn muốn xoá mặt hàng ?</p>
      <div class="text-end">
        <b-button variant="danger" class="mx-2 btn-sm" @click="hideDeleteModal">Huỷ bỏ</b-button>
        <b-button variant="success"  class="btn-sm" @click="removeItemGoods">Đồng ý</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from "@/store/BaseRequest";
import moment from "moment";
export default {
  props: ["id"],
  created: function() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.loading = true;
    BaseRequest.get("/order/" + this.id).then(response => {
      this.loading = false;
      this.inforOrder = response.data;
    });
  },
  data() {
    return {
      fixSuccess: false,
      addSuccess:false,
      removeSuccess: false,
      inforOrder: {},
      itemGoods: {},
      currentItemId:null,
      errorMessage:{},
      loading:false,
      user: {},
      permissionIds: [],
    };
  },
  methods: {
    moment: function() {
      return moment();
    },
    showItemGoods(id) {
      BaseRequest.get("/goods/" + id)
      .then(response => {
        this.itemGoods = response.data;
      });
    },
    showAddModal() {
      this.errorMessage = {}
      this.itemGoods = {}
      this.$refs['my-modal3'].show()
    },
    showDeleteModal(id) {
      this.currentItemId = id;
      this.$refs['my-modal2'].show()
    },
    hideDeleteModal() {
      this.$refs['my-modal2'].hide()
    },
    addItemGoods() {
      BaseRequest.post("/add-goods-to-order/" + this.id, this.itemGoods)
      .then(()=> {
        this.$refs["my-modal3"].hide();
        setTimeout(() => {
          this.addSuccess = false;
        }, 1000);
        this.addSuccess = true;
        BaseRequest.get("/order/" + this.id).then(response => {
          this.inforOrder = response.data;
          this.errorMessage = {}
          this.itemGoods = {}
        });
      })
      .catch(error => {
        this.errorMessage = error.response.data.errors;
      })      
    },
    removeItemGoods() {
      BaseRequest.delete("/goods/" + this.currentItemId +"/delete")
      .then(()=> {
        this.$refs["my-modal2"].hide();
        setTimeout(() => {
            this.removeSuccess = false;
          }, 1000);
        this.removeSuccess = true;
        BaseRequest.get("/order/" + this.id).then(response => {
          this.inforOrder = response.data;
        });
      })
    },
    updateItemGoods(id) {
      BaseRequest.put("/goods/update-information-goods/" + id, this.itemGoods)
        .then(() => {
          this.errorMessage = {}
          this.$refs["my-modal"].hide();
          setTimeout(() => {
            this.fixSuccess = false;
          }, 1000);
          this.fixSuccess = true;
          BaseRequest.get("/order/" + this.id).then(response => {
            this.inforOrder = response.data;
          });
        })
        .catch(error => {
          this.errorMessage = error.response.data.errors;
        });
    },
    hasHistory() { 
      return window.history.length > 2 
    },
    checkPermission: function(id = []){
      if(this.user.role_id == 1)
        return true;
      else{
        for(let i=0; i < id.length; i++){
          if(this.permissionIds.includes(id[i])){
            return true;
          }
        }
      }
      return false;
    },
  },
  filters: {
    convertVND(money) {
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    },
    moment(date) {
      return moment(date).format("D/MM/YYYY");
    }
  }
};
</script>

<style scoped>
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
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
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
    content: "";
  }
}
</style>