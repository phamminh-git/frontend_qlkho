<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Lịch sử hoạt động</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Nội dung</th>
          <th>Thời gian</th>
          <th>Nhân viên</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in history" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{ item.content }}</td>
          <td>{{ item.created_at | moment}}</td>
          <td>
            <router-link :to="{ name: 'Danhsachlichsu', params: { id:item.user.id }}" class="router-link">
            {{item.user.name}}
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
      @change="getHistory"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import BaseRequest from '@/store/BaseRequest'
import moment from 'moment'

export default {
  created() {
    this.getHistory();
  },
  data(){
    return {
      history: null,
      currentPage: 1,
      rows: 2,
      perPage: 40,
      loading:false
    }
  },
  methods:{
    getHistory(page) {
      this.loading = true;
      BaseRequest.get('/histories?per_page='+ this.perPage, {page})
      .then(response => {
        this.loading = false;
        this.history = response.data.data
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
    })
    },
    moment() {
    return moment();
    },
    hasHistory () { return window.history.length > 2 }
  },
  filters: {
    moment: function (date) {
      return moment(date).format('D/MM/YYYY, H:mm:ss');
    }
  }
}
</script>

<style scoped>
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
  color: #28a745;
}
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
	td:nth-of-type(2):before { 
    top: 84.5px;
    content: "Nội dung"; }
	td:nth-of-type(3):before { content: "Ngày"; }
	td:nth-of-type(4):before { 
    top: 19.5px;
    content: "Nhân viên"; }
}
</style>