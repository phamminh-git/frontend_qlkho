<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Danh sách lịch sử</h2>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Nội dung</th>
          <th>Thòi gian</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in history" :key="index">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td style="width: 70%" class="text-start">{{ item.content }}</td>
          <td>{{ item.created_at | moment}}</td>
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
    props: ['id'],
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
      BaseRequest.get('/histories?user_id=' + this.id + '&per_page=' + this.perPage, {page})
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

</style>