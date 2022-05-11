<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Chi phí xe ({{licensePlate}})</h2>
    <div class="alert alert-success" v-if="confirmSuccess">Nhập thông tin thành công</div>
    <div class="alert alert-success" v-if="fixSuccess">Sửa thông tin thành công</div>
    <div class="alert alert-success" v-if="removeSuccess">Xoá chi phí thành công</div>
    <div class="d-flex justify-content-between px-2 pt-4 mb-3">
      <form>
        <b-form-datepicker id="start_day" v-model="date"  class="mb-2" 
          locale="vi" placeholder="Lọc theo ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
          label-close-button="Đóng" close-button @input="getCostOfCar()">
        </b-form-datepicker>
      </form>
      <div>
          <b-button variant="primary" @click="showModal" class="mb-3 ms-2 btn-sm d-flex justify-content-start" v-if="checkPermission([18])">Nhập chi phí</b-button>
      </div>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên chi phí</th>
          <th>Ngày di chuyển</th>
          <th>Chi phí</th>
          <th v-if="checkPermission([19,20])"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(itemCost,index) in listCost" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ itemCost.name}}</td>
          <td>{{ itemCost.date | moment }}</td>
          <td>{{ itemCost.cost | convertVND}}</td>
          <td v-if="checkPermission([19,20])">
            <button class="btn btn-danger btn-sm" align="center" @click="showDeleteModal(itemCost.id)" v-if="checkPermission([20])">Xoá</button>
            <b-button v-b-modal.modal-2 variant="success" class="mx-3 btn-sm" @click="showModalFix(itemCost.id)" v-if="checkPermission([19])">Sửa</b-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-start ms-2">
      <label for="total_cost" class="h4">Tổng chi phí:</label>
      <span name="total_cost" class="h4">
        {{ total | convertVND }}
      </span>
    </div>
    <br>
    <!-- =========modal-nhập========= -->
    <b-modal title="Nhập thông tin chi phí" :hide-footer="true" ref="my-modal">
      <form action="" @submit.prevent="confirm">
        <div class="row align-items-center mt-4">
            <div class="col-4">
                <label for="start">Tên chi phí:</label>
            </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập tên chi phí" v-model="addCost.name" @change="error_message.name = null"/>
            <div class="text-danger" v-if="error_message.name" >
              {{ error_message.name[0] }}
            </div> 
          </div>
        </div>
        <div class="row align-items-center mt-4">
            <div class="col-4">
                <label for="start">Chi phí:</label>
            </div>
          <div class="col">
            <input type="number" class="form-control" placeholder="Nhập chi phí" v-model="addCost.cost" @change="error_message.cost = null"/>
            <div class="text-danger" v-if="error_message.cost" >
              {{ error_message.cost[0] }}
            </div> 
          </div>
        </div>
        <div class="row align-items-center mt-4">
            <div class="col-4">
                <label for="start">Ngày di chuyển:</label>
            </div>
          <div class="col">
            <form action="">
            <b-form-datepicker id="select_day" v-model="addCost.date"  class="mb-2" 
              locale="vi" placeholder="Chọn ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
              label-close-button="Đóng" close-button @change="error_message.date = null">
            </b-form-datepicker>
            </form>
            <!-- ===== -->
            <div class="text-danger" v-if="error_message.date" >
              {{ error_message.date[0]}}
            </div> 
          </div>
        </div>
        <div class="text-center py-2 mt-4">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Xác nhận</button>
        </div>
      </form>
    </b-modal>
    <!-- =========modal-fix========= -->
    <b-modal title="Sửa thông tin chi phí" :hide-footer="true" ref="my-modal-fix">
      <h5><strong>Ngày: {{fixCost.date | moment }}</strong></h5>
      <form action="" @submit.prevent="updateItem(fixCost.id)">
        <div class="row align-items-center mt-4">
            <div class="col-4">
                <label for="start">Tên chi phí:</label>
            </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="Nhập tên chi phí" v-model="fixCost.name" @change="error_cost_message.name=null"/>
            <div class="text-danger" v-if="error_cost_message.name">
              {{ error_cost_message.name[0] }}
            </div> 
          </div>
        </div>
        <div class="row align-items-center mt-4">
            <div class="col-4">
                <label for="start">Chi phí:</label>
            </div>
          <div class="col">
            <input type="number" class="form-control" placeholder="Nhập chi phí" v-model="fixCost.cost" @change="error_cost_message.cost=null"/>
            <div class="text-danger" v-if="error_cost_message.cost">
              {{ error_cost_message.cost[0] }}
            </div> 
          </div>
        </div>
        <div class="text-center py-2 mt-4">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <!-- =========modal-xoá========= -->
    <b-modal title="Xoá" ref="my-modal2" hide-footer>
      <p class="mb-4">Bạn có chắc chắn muốn xoá chi phí ?</p>
      <div class="text-end">
        <b-button variant="success" class="mx-2 btn-sm" @click="hideDeleteModal">Huỷ bỏ</b-button>
        <b-button variant="danger"  class="btn-sm" @click="removeItemGoods">Đồng ý</b-button>
      </div>
    </b-modal>
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
import BaseRequest from '@/store/BaseRequest'
import moment from 'moment'

export default {
  namespaced : true ,
  props: ['licensePlate', 'id'],
  data(){
    return {
      error_message:{},
      error_cost_message:{},
      confirmSuccess:false,
      fixSuccess:false,
      listCost: [],
      addCost: {
        date: null,
        cost:null,
        name:null
      },
      fixCost: {},
      currentPage: 1,
      rows: 3,
      perPage: 40,
      currentItemId:'',
      removeSuccess:false,
      date:'',
      total:0,
      user: {},
      permissionIds: []
    }
  },
  created: function(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionIds = this.user.permissions.map(({ id }) => id);
    this.getCostOfCar()
  },
  watch: {
    currentPage() {
      if(this.date != null){
        this.getListCar()
      }
      else {
        this.getListCar()
      }
    }
  },
  methods: {
    getCostOfCar() {
      this.loading = true;
      BaseRequest.get('/cost-of-car/' + this.id + "?per_page=" + this.perPage + "&date=" + this.date, {page:this.currentPage})
      .then(response => {
      this.loading = false;
      this.listCost = response.data.costOfCar.data;
      this.currentPage = response.data.costOfCar.current_page;
      this.rows = response.data.costOfCar.total;
      this.handleTotal()
      })
    },
    handleTotal() {
      let newTotal = 0
      this.listCost.forEach(itemCost=> {
        newTotal += itemCost.cost;
      })
      this.total = newTotal;
    },
    confirm: function() {
      BaseRequest.post('/cost-of-car/' + this.id, {
        date: this.addCost.date,
        cost: this.addCost.cost,
        car_id: this.id,
        name: this.addCost.name
      })
      .then(()=> {
        this.$refs['my-modal'].hide()
        setTimeout(()=> {
          this.confirmSuccess = false;
        },1000)
        this.confirmSuccess = true;
        this.addCost.cost = null;
        this.addCost.date = null;
        this.addCost.name = null;
        this.getCostOfCar(1)
        })
      .catch( error => {
        this.error_message = error.response.data.errors
      })
    },
    updateItem(id) {
      BaseRequest.put('/cost-of-car/'+id, this.fixCost)
      .then(()=> {
        this.$refs['my-modal-fix'].hide()
        setTimeout(()=> {
          this.fixSuccess = false;
        },1000)
        this.fixSuccess = true;
        this.getCostOfCar()
      })
      .catch( error => {
        this.error_cost_message = error.response.data.errors;
      })
    },
    showDeleteModal(id) {
      this.currentItemId = id;
      this.$refs['my-modal2'].show()
    },
    hideDeleteModal() {
      this.$refs['my-modal2'].hide()
    },
    removeItemGoods() {
      BaseRequest.delete('/cost-of-car/' + this.currentItemId)
      .then(()=> {
        this.$refs["my-modal2"].hide();
        setTimeout(() => {
          this.removeSuccess = false;
        }, 1000);
        this.removeSuccess = true;
        this.getCostOfCar();
      })
    },
    moment: function () {
      return moment();
    },
    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
    showModalFix(id) {
      this.$refs['my-modal-fix'].show()
      BaseRequest.get('/cost-of-car/' +id +'/edit')
      .then(response => {
      this.fixCost = response.data;
      })
    },
    hasHistory () { return window.history.length > 2 },
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
    convertVND(money){
      return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    },
    moment: function (date) {
    return moment(date).format('D/MM/YYYY');
    }
  },
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
	td:nth-of-type(2):before { content: "Ngày di chuyển"; }
	td:nth-of-type(3):before { content: "Tổng chi phí"; }
	td:nth-of-type(4):before { content: ""; }
}
</style>