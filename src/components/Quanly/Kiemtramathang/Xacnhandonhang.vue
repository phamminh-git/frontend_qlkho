<template>
    <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
      <h2>Nhập kho mặt hàng</h2>
      <b-alert variant="success" :show="dismissCountDown" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged" dismissible>
        Nhập kho mặt hàng thành công
      </b-alert>        
      <div id="search-box" class="mx-2 mb-2">
          <b-form-input type="text" placeholder="Tìm SĐT" v-model="phone" v-debounce:300ms="getOrder"></b-form-input>		
      </div>
      <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
      <table class="table table-striped table-bordered" v-if="!loading">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên người gửi</th>
            <th>Địa chỉ người gửi</th>
            <th>SĐT người gửi</th>
            <th>Tên mặt hàng</th>
            <th>Số lượng</th>
            <th>Ngày gửi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(good, index) in goods" :key="index">
              <td>{{index + 1}}</td>
              <td>{{good.order.nameSender}}</td>
              <td>{{good.order.addressSender}}</td>
              <td><a :href="`tel:${good.order.phoneSender}`">{{good.order.phoneSender}}</a></td>
              <td>{{good.name}}</td>
              <td>{{good.quantity}} {{good.unit}}</td>
              <td>{{good.order.created_at | formatDate }}</td>
              <td>
                <b-button variant="primary" class="btn-sm" @click.prevent="confirmOrderSuccess = true; id = good.id" v-b-modal.modalPopover>Nhập kho</b-button>							
              </td>						
          </tr>
          <b-modal id="modalPopover" title="Xác nhận mặt hàng" hide-footer>
            <b-button size="sm" variant="primary" @click="confirmOrder(id); $bvModal.hide('modalPopover')" class="modal-btn">Đồng ý</b-button>						
            <b-button size="sm" variant="danger" @click="$bvModal.hide('modalPopover')" class="modal-btn">Hủy bỏ</b-button>					
          </b-modal>						
        </tbody>
      </table>
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

export default {
  mounted(){
    this.getlistOrder()
  },
  data() {
     return {
        goods: null,
        confirmOrderSuccess: false,
        id: 0,
        phone: null,
        dismissSecs: 3,
        dismissCountDown: 0,
        currentPage: 1,
        rows: 3,
        perPage: 40,        
        loading:false
     }
  },
  methods: {
    confirmOrder: function(id) {
      BaseRequest.put('/confirm-goods/' + id)
      .then( () => {
        this.dismissCountDown = this.dismissSecs
        if(this.phone != null){
          this.getOrder()
        }else{
          this.getlistOrder()
        }			
      })
    },
    getOrder() {
      this.loading = true;
      BaseRequest.get('/get-goods-not-confirm?key_word=' + this.phone + "&per_page=" + this.perPage, {page: this.currentPage})	
      .then(response =>{
        this.loading = false;
        this.goods = response.data.data
        this.currentPage = response.data.current_page
        this.rows = response.data.total
      })		
    },
    getlistOrder(){
      this.loading = true;
      BaseRequest.get('/get-goods-not-confirm?per_page=' + this.perPage, {page: this.currentPage})
      .then(response =>{
        this.loading = false;
        this.goods = response.data.data
        this.currentPage = response.data.current_page
        this.rows = response.data.total
      })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
     hasHistory () { return window.history.length > 2 }
  },
  watch: {
    currentPage: function(){
      if(this.phone != null){
        this.getOrder()
      }else{
        this.getlistOrder()
      }
    }
  }

}
</script>

<style scoped>
#search-box{
  width: 200px;
}
.modal-btn{
  float: right;
  margin-right: 5px;
}
@media only screen and (max-width: 1140px) {
  *{
    overflow: scroll;
  }
  #search-box{
    float: none;
    margin: 20px auto;
  }
	table, thead, tbody, th, td, tr { 
		display: block; 
	}
	thead th { 
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
	td:nth-of-type(4):before { content: "SĐT người gửi"; }
	td:nth-of-type(5):before { content: "Tên mặt hàng"; }
	td:nth-of-type(6):before { content: "Số lượng"; }
	td:nth-of-type(7):before { content: "Ngày gửi"; }   
	td:nth-of-type(8):before { content: "Chức năng"; }  
}
</style>