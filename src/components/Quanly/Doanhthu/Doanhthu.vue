<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Thống kê doanh thu</h2>
    <form class="thoigianthongke px-2" @submit.prevent="revenue()">
      <div class="form-date">
        <b-form-datepicker id="start_day" v-model="start_day"  class="mb-2" 
        locale="vi" placeholder="Từ ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
        label-close-button="Đóng" close-button>
        </b-form-datepicker>
        <div class="text-danger" align="center" v-if="errors !== null && errors.start_day" >
          {{ errors.start_day[0] }}
        </div>
      </div>
      <div class="form-date">
        <b-form-datepicker id="end_day" v-model="end_day"  class="mb-2" 
        locale="vi" placeholder="Đến ngày" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        label-today-button="Ngày Hôm Nay" today-button label-reset-button="Đặt Lại" reset-button 
        label-close-button="Đóng" close-button>
        </b-form-datepicker>        
        <div class="text-danger" align="center" v-if="errors !== null && errors.end_day" >
          {{ errors.end_day[0] }}
        </div>
      </div>
      <div>
        <b-button class="btn-xl" variant="primary" type="submit">Xem thống kê</b-button>
      </div>
    </form>
    <div class="chiphi">
      <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
      <table class="table table-striped table-bordered mt-3" v-if="!loading">
        <thead>
          <th>Tổng tiền thu của khách hàng:</th>
          <th>Tổng chi phí gửi xe:</th>
          <th>Tổng chi phí đi lại của xe:</th>
        </thead>
        <tbody v-show="total != null">
          <tr>
            <td>
              <router-link name="total_fare" :to="{ name: 'Danhsachdonhang', query: {start: start_day, end: end_day}}" class="router-link" v-if="total !== null">
                  {{ total.total_fare | baonhieutien | dinhdangtien | vietnamDong}}         
              </router-link>              
            </td>
            <td>
              <router-link name="total_fare_of_car" :to="{ path: '/dashboardadmin/doanhthu/danhsachmathangxeplenxe', query: {start: start_day, end: end_day} }" class="router-link" v-if="total !== null">
                  {{ total.total_fare_of_car | baonhieutien | dinhdangtien | vietnamDong }}           
              </router-link>              
            </td>
            <td>
              <router-link name="total_cost_of_car" :to="{ path: '/dashboardadmin/doanhthu/danhsachchiphi', query: {start: start_day, end: end_day} }" class="router-link" v-if="total !== null">
                {{ total.total_cost_of_car | baonhieutien | dinhdangtien | vietnamDong}}            
              </router-link>              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="doanhthu" v-if="!loading">
      <label for="total_debts" class="h4 me-3">Tổng doanh thu: </label>
      <span name="total_debts" class="h4" v-if="total !== null">
        {{ total.total_debts | baonhieutien | dinhdangtien | vietnamDong}}
      </span>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import BaseRequest from '../../../store/BaseRequest'
export default {
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
      start_day: null,
      end_day: null,
      errors: null,
      total: null,
      loading: false
    }
  },
  methods: {
    revenue: function(){
      BaseRequest.get('/admin/stat-revenue?start_day=' + this.start_day + '&end_day=' + this.end_day)
      .then(response => {
        this.errors = null
        this.total = response.data
      })
      .catch(error => {
        this.errors = error.response.data.errors
      })
    },
     hasHistory () { return window.history.length > 2 }
  }
}
</script>

<style scoped>
.thoigianthongke{
  display: flex;
  margin-bottom: 50px;
}
.form-date{
  margin-right: 10px;
}
.chiphi{
  justify-content: space-around;
  margin-bottom: 50px;
}
.doanhthu{
  border-bottom: 1px solid black;
}
.content{
  padding-top: 20px;
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
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}   
.router-link:hover{
  background-color: #0069d9;
  border-color: #0062cc;
}
@media only screen and (max-width: 580px) {
  .thoigianthongke{
    display: block;
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
		top: 19.5px;
		left: 6px;
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
	}
  td:nth-of-type(1)::before {content: "Tiền thu của khách hàng";}
  td:nth-of-type(2)::before {content: "Chi phí gửi xe";}
  td:nth-of-type(3)::before {content: "Chi phí đi lại của xe";}
}
</style>