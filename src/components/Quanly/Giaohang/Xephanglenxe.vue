<template>
  <div class="pt-2">
    <b-button
      type="button"
      @click="hasHistory() ? $router.go(-1) : $router.push('/')"
      class="d-flex justify-content-start mx-2 btn btn-sm"
    >&laquo; Quay lại</b-button>
    <h2>Xếp hàng lên xe</h2>
    <hr />
    <b-alert
      variant="success"
      :show="dismissCountDown"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
      dismissible
    >Xếp hàng lên xe thành công</b-alert>
    <b-alert :show="msg != null" variant="danger">{{msg}}</b-alert>
    <b-alert :show="msg2 != null" variant="danger">{{msg2}}</b-alert>
    <div class="row">
      <div class="col-5">
        <p>Chọn nhà xe</p>
        <b-form-select v-model="garageId">
          <option :value="garage.id" v-for="(garage, index) in garages" :key="index">{{garage.name}}</option>
        </b-form-select>
      </div>
      <div class="col-5">
        <p>Biển số xe</p>
        <b-form-select v-model="carId">
          <option v-for="(car, index) in cars" :key="index" :value="car.id">{{car.licensePlate}}</option>
        </b-form-select>
      </div>
    </div>
    <hr />
    <div class="row" id="selection">
      <div class="col col-6">
        <p style="float: left;">Chọn mặt hàng</p>
      </div>
      <div class="col col-4">
        <b-form-input
          type="text"
          style="float: right"
          placeholder="Tìm SĐT"
          v-model="phone"
          v-debounce:300ms="searchOrder"
          id="input-search"
        ></b-form-input>
      </div>
    </div>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <div class="table-responsive" v-if="!loading">
      <table class="table table-striped table-bordered mt-3">
        <thead>
          <th>STT</th>
          <th>Tên mặt hàng</th>
          <th>Số lượng</th>
          <th>Địa chỉ người nhận</th>
          <th>SĐT người nhận</th>
          <th>Ngày gửi</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(good, index) in goods" :key="index">
            <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
            <td>{{good.name}}</td>
            <td>{{good.quantity}} {{good.unit}}</td>
            <td>{{good.order.addressSender}}</td>
            <td>
              <a :href="`tel:${good.order.phoneSender}`">{{good.order.phoneSender}}</a>
            </td>
            <td>{{good.order.created_at | formatDate }}</td>
            <td>
              <b-form-checkbox
                v-model="goodToSendList[good.goods_id].selected"
                @change="$forceUpdate()"
              >Nhập cước xe</b-form-checkbox>
              <div class="row" v-show="goodToSendList[good.goods_id].selected">
                <div class="col col-9">
                  <b-form-input
                    id="fareofcar"
                    type="number"
                    v-model="goodToSendList[good.goods_id].fareOfCar"
                    placeholder="Nhập cước xe"
                    size="20"
                  ></b-form-input>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
    <b-button variant="primary" class="btn-sm" @click="loadOrder">In phiếu giao hàng</b-button>
  </div>
</template>

<script>
import BaseRequest from "../../../store/BaseRequest";
export default {
  data() {
    return {
      garages: [],
      garageId: null,
      cars: [],
      carId: null,
      goods: [],
      gsend: {
        goods: []
      },
      phone: null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      dismissSecs: 3,
      dismissCountDown: 0,
      msg: null,
      msg2: null,
      loading: false,
      goodToSendList: {}
    };
  },
  mounted() {
    this.getGarages();
    this.getGoods();
  },
  methods: {
    getCars() {
      BaseRequest.get("/car?carrental_id=" + this.garageId).then(response => {
        this.cars = response.data.data;
      });
    },
    loadOrder() {
      const sendGoods = Object.keys(this.goodToSendList)
      console.log(sendGoods)
        .map(goodsId => {
          console.log(this.goodToSendList);
          return { ...this.goodToSendList[goodsId], goods_id: goodsId };
        })
        .filter(good => good.selected);
      BaseRequest.put("/load-goods-on-car?car_id=" + this.carId, {
        goods: sendGoods
      })
        .then(() => {
          this.dismissCountDown = this.dismissSecs;
          this.msg = null;
          this.msg2 = null;
          if (this.phone != null) {
            this.searchOrder();
          } else {
            this.getGoods();
          }
        })
        .catch(error => {
          this.msg = error.response.data.errors.car_id?.join(",");
          this.msg2 = error.response.data.errors.goods?.join(",");
        });
    },
    searchOrder() {
      BaseRequest.get(
        "/get-goods-not-load-car?key_word=" +
          this.phone +
          "&per_page=" +
          this.perPage,
        { page: this.currentPage }
      ).then(response => {
        const receivedGoods = response.data.data;
        this.goods = receivedGoods.map(good => {
          good.selected = false;
          good.fareOfCar = 0;
          good.goods_id = good.id;
          return good;
        });
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
        this.generateGoodToSendList(this.goods);
      });
    },
    getGarages() {
      BaseRequest.get("/carrental").then(response => {
        this.garages = response.data.data;
      });
    },
    getGoods() {
      this.goods = [];
      this.loading = true;
      BaseRequest.get("/get-goods-not-load-car?per_page=" + this.perPage, {
        page: this.currentPage
      }).then(response => {
        this.loading = false;
        const receivedGoods = response.data.data;
        this.goods = receivedGoods.map(good => {
          good.selected = false;
          good.fareOfCar = 0;
          good.goods_id = good.id;
          return good;
        });
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
        this.generateGoodToSendList(this.goods);
      });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    hasHistory() {
      return window.history.length > 2;
    },
    generateGoodToSendList(goodList) {
      goodList.forEach(goodItem => {
        this.goodToSendList[goodItem.goods_id];
        if (
          (this.goodToSendList[goodItem.goods_id])!=null &&
          (Object.values(this.goodToSendList[goodItem.goods_id]).length)!=null
        ) {
          // console.log("sddd");
        } 
        else {
          this.goodToSendList[goodItem.goods_id] = { selected: null };
        }
      });
    }
  },
  watch: {
    garageId: function() {
      this.getCars();
    },
    currentPage: function() {
      if (this.phone != null) {
        this.searchOrder();
      } else {
        this.getGoods();
      }
    }
  }
};
</script>

<style scoped>
* {
  overflow: hidden;
}
.row {
  justify-content: space-around;
}
p {
  font-size: 20px;
}

@media only screen and (max-width: 1140px) {
  * {
    overflow: scroll;
  }
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead th {
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
    content: "Ten mat hang";
  }
  td:nth-of-type(3):before {
    content: "So luong";
  }
  td:nth-of-type(4):before {
    content: "Dia chi nguoi nhan";
  }
  td:nth-of-type(5):before {
    content: "SDT người nhận";
  }
  td:nth-of-type(6):before {
    content: "Ngày gửi";
  }
  td:nth-of-type(7):before {
    content: "";
  }
}
</style>