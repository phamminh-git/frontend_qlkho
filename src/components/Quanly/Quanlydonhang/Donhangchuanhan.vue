<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Đơn hàng chưa đến kho</h2>
    <div class="alert alert-success" v-if="fixOrderSuccess">Sửa đơn hàng thành công</div>
    <div class="alert alert-success" v-if="removeSuccess">Xoá đơn hàng thành công</div>
    <div class="d-flex justify-content-between px-2">
      <div class="text-start d-inline w-90">
        <b-form-datepicker id="dateCreated" v-model="dateCreated"  class="mb-2" 
        locale="vi" placeholder="Lọc theo ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
        label-close-button="Đóng" close-button @input="getListOrderNotRecevied(1)">
        </b-form-datepicker>        
      </div>
      <div class="text-end d-inline w-10" v-if="checkPermission([1])">
        <router-link
          :to="{ path: '/dashboardadmin/quanlidonhang/taodonhang' }"
          class="router-link btn-create"
        >Thêm đơn hàng</router-link>
      </div>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered mt-2" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên người gửi</th>
          <th>Địa chỉ người gửi</th>
          <th>Số ĐT người gửi</th>
          <th>Tên người nhận</th>
          <th>Địa chỉ người nhận</th>
          <th>Ngày tạo</th>
          <th v-if="checkPermission([3])"></th>
          <th v-if="checkPermission([2])"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listOrderNotRecevied" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{item.nameSender}}</td>
          <td>{{item.addressSender}}</td>
          <td><a :href="`tel:${item.phoneSender}`">{{item.phoneSender}}</a></td>
          <td>{{item.nameReceiver}}</td>
          <td>{{item.addressReceiver}}</td>
          <td>{{item.created_at | moment}}</td>
          <td v-if="checkPermission([3])">
            <b-button class="btn btn-danger btn-sm" align="center" @click="showDeleteModal(item.id)">Xoá</b-button>
          </td>
          <td v-if="checkPermission([2])"><b-button class="btn btn-success mx-2 btn-sm" @click="showModal(item.id)">Sửa</b-button></td>
          <td>
            <router-link
              :to="{ path: '/dashboardadmin/quanlidonhang/donhangchuanhan/' + item.id }"
              class="router-link"
            >Xem hàng</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- ===================modal update order========================= -->
    <b-modal
      id="modal-1"
      title="Sửa thông tin đơn hàng"
      :hide-footer="true"
      size="lg"
      ref="my-modal"
    >
      <form action @submit.prevent="handleUpdateItemOrder">
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Tên người gửi:</label>
          </div>
          <div class="col-9">
            <input type="text" class="form-control" v-model="itemOrder.nameSender" />
          </div>
        </div>
        <div
          class="text-center text-danger"
          v-if="errorMessage.nameSender"
        >{{errorMessage.nameSender[0]}}</div>
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Địa chỉ người gửi:</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="itemOrder.addressSender" />
          </div>
        </div>
        <div
          class="text-danger text-center"
          v-if="errorMessage.addressSender"
        >{{errorMessage.addressSender[0]}}</div>
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Số điện thoại người gửi:</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="itemOrder.phoneSender" />
          </div>
        </div>
        <div
          class="text-center text-danger"
          v-if="errorMessage.phoneSender"
        >{{errorMessage.phoneSender[0]}}</div>
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Tên người nhận:</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="itemOrder.nameReceiver" />
          </div>
        </div>
        <div
          class="text-center text-danger"
          v-if="errorMessage.nameReceiver"
        >{{errorMessage.nameReceiver[0]}}</div>
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Địa chỉ người nhận:</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="itemOrder.addressReceiver" />
          </div>
        </div>
        <div
          class="text-danger text-center"
          v-if="errorMessage.addressReceiver"
        >{{errorMessage.addressReceiver[0]}}</div>
        <div class="row align-items-center mt-2">
          <div class="col-3">
            <label for="start">Số điện thoại người nhận:</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="itemOrder.phoneReceiver" />
          </div>
        </div>
        <div
          class="text-center text-danger"
          v-if="errorMessage.phoneReceiver"
        >{{errorMessage.phoneReceiver[0]}}</div>
        <div class="text-center py-2 mt-2">
          <button type="submit" class="btn btn-primary" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <!-- ==========modal delete======== -->
    <b-modal title="Xoá" ref="my-modal2" hide-footer>
      <p class="mb-4">Bạn có chắc chắn muốn xoá đơn hàng ?</p>
      <div class="text-end">
        <b-button variant="success" class="mx-2" @click="hideDeleteModal">Huỷ bỏ</b-button>
        <b-button variant="danger" @click="removeOder">Xoá đơn hàng</b-button>
      </div>
    </b-modal>
    <br />
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
import BaseRequest from "@/store/BaseRequest";
import moment from "moment";
export default {
  created: function() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.getListOrderNotRecevied(1);
  },
  data() {
    return {
      itemId: "",
      fixOrderSuccess: false,
      dateCreated: "",
      listOrderNotRecevied: null,
      itemOrder: "",
      errorMessage: {},
      createSuccess: false,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      removeSuccess: false,
      currentOrderId: "",
      loading:false,
      user: {},
      permissionIds: [],
    };
  },
  watch: {
  currentPage: function(){
    if(this.dateCreated != null){
      this.getListCar()
    }
    else {
      this.getListCar()
    }
  }
  },
  methods: {
    showModal(id) {
      this.itemId = id;
      BaseRequest.get("/order/" + id + "/edit").then(response => {
        this.itemOrder = response.data;
      });
      this.$refs["my-modal"].show();
    },
    handleUpdateItemOrder() {
      BaseRequest.put("/order/" + this.itemId, this.itemOrder)
        .then(() => {
          this.$refs["my-modal"].hide();
          setTimeout(() => {
            this.fixOrderSuccess = false;
          }, 1000);
          this.fixOrderSuccess = true;
          this.getListOrderNotRecevied(1);
        })
        .catch(error => {
          this.errorMessage = error.response.data.errors;
        });
    },
    getListOrderNotRecevied() {
      this.loading = true;
      BaseRequest.get("/get-order-not-receive?date=" +this.dateCreated +"&per_page=" +this.perPage, { page: this.currentPage}).then(response => {
        this.loading = false;
        this.listOrderNotRecevied = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      });
    },
    showDeleteModal(id) {
      this.currentOrderId = id;
      this.$refs["my-modal2"].show();
    },
    hideDeleteModal() {
      this.$refs["my-modal2"].hide();
    },
    removeOder(page) {
      BaseRequest.delete("/order/" + this.currentOrderId).then(() => {
        this.$refs["my-modal2"].hide();
        setTimeout(() => {
          this.removeSuccess = false;
        }, 1000);
        this.removeSuccess = true;
        BaseRequest.get("/get-order-not-receive?per_page=" + this.perPage, {
          page
        }).then(response => {
          this.listOrderNotRecevied = response.data.data;
          this.currentPage = response.data.current_page;
          this.rows = response.data.total;
        });
      });
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
    moment: function() {
      return moment();
    },
     hasHistory () { return window.history.length > 2 }
  },
  filters: {
    moment: function(date) {
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
.btn-create {
  background-color: #5A6268;
  border-color: #5A6268;
}
.modal-ku {
  width: 750px;
  margin: auto;
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
    content: "Tên người gửi";
  }
  td:nth-of-type(3):before {
    content: "Địa chỉ người gửi";
  }
  td:nth-of-type(4):before {
    content: "SĐT người gửi";
  }
  td:nth-of-type(5):before {
    content: "Tên người nhận";
  }
  td:nth-of-type(6):before {
    content: "Địa chỉ người nhận";
  }
  td:nth-of-type(7):before {
    content: "Ngày tạo đơn hàng";
  }
  td:nth-of-type(7):before {
    content: "";
  }
}
</style>