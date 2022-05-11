<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Đơn hàng đã nhận</h2>
    <b-alert variant="success" :show="dismissCountDown" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged" dismissible>
      Huỷ xác nhận mặt hàng thành công
    </b-alert>
    <div class="text-start px-2 pt-2" id="date-input">
      <!-- <label for="dateCreated" class="h5 me-3">Lọc theo ngày :</label>
      <input class="form-control" type="date" id="dateCreated" v-model="dateCreated" @change="getListOrderRecevied"> -->
      <b-form-datepicker id="start_day" v-model="dateCreated"  class="mb-2" 
      locale="vi" placeholder="Lọc theo ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
      label-close-button="Đóng" close-button @input="getListOrderRecevied">
      </b-form-datepicker>
    </div>
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
          <th>Ngày tạo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listOrderReceive" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{item.nameSender}}</td>
          <td>{{item.addressSender}}</td>
          <td><a :href="`tel:${item.phoneSender}`">{{item.phoneSender}}</a></td>
          <td>{{item.nameReceiver}}</td>
          <td>{{item.addressReceiver}}</td>
          <td>{{item.created_at | moment}}</td>
          <td>
            <router-link
            :to="{ path: '/dashboardadmin/quanlidonhang/donhangdanhan/' + item.id }"
            class="router-link"
            >Xem đơn hàng
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
  created: function(){
    this.getListOrderRecevied(1);
  },
  data(){
    return {
      dateCreated:'',
      listOrderReceive: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      loading:false,
      dismissSecs: 3,
      dismissCountDown: 0,
      id: 0
    }
  },
  filters: {
    moment: function (date) {
    return moment(date).format('D/MM/YYYY');
    }
  },
  watch: {
  currentPage: function(){
    if(this.dateCreated != null){
      this.getListOrderRecevied()
    }
    else {
      this.getListOrderRecevied()
    }
  }
  },
  methods: {
    getListOrderRecevied() {
      this.loading = true;
      BaseRequest.get("/get-order-receive?date=" + this.dateCreated + "&per_page=" + this.perPage, { page: this.currentPage}).then(
        response => {
          this.loading = false;
          this.listOrderReceive = response.data.data;
          this.currentPage = response.data.current_page;
          this.rows = response.data.total;
        }
      );
    },
    moment: function () {
      return moment();
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
     hasHistory () { return window.history.length > 2 }

  }
}
</script>

<style scoped>
.px-5 {
  padding-right: 12.6rem !important;
  padding-left: 12.6rem !important;
}
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
  background-color: #0d6efd;
  border-color: #0d6efd;
  margin-right: 10px;
}
/* .form-control {
  display: inline-block;
  width: 200px;
} */
#date-input{
  max-width: 200px;
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
  .btn-sm{
    margin-top: 10px;
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
    content: "Ngày";
  }
  td:nth-of-type(7):before {
    content: "";
  }
}
</style>