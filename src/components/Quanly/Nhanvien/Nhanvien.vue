<template>
  <div class="pt-2">
    <b-button type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')" class="d-flex justify-content-start mx-2 btn btn-sm">&laquo; Quay lại</b-button>
    <h2>Nhân viên</h2>
    <div class="alert alert-success" v-if="cancel_success">Huỷ hoạt động nhân viên thành công</div>
    <div class="alert alert-success" v-if="resetPasswordSuccess">Đặt lại mật khẩu thành công</div>
    <div class="alert alert-success" v-if="register_success">Thêm nhân viên thành công</div>
    <div class="alert alert-success" v-if="fix_success">Lưu thành công</div>
    <b-button
      @click="showregister = !showregister"
      class="button_register_employee btn-sm d-flex justify-content-start ms-2"
    >Thêm nhân viên</b-button>
    <b-spinner label="Spinning" class="mb-5" v-if="loading"></b-spinner>
    <table class="table table-striped table-bordered" v-if="!loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ và tên</th>
          <th>Số điện thoại</th>
          <th>Số CMT/CCCD</th>
          <th>Địa chỉ</th>
          <th>Vị trí</th>
          <th>Mức lương</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(getemployee, index) in getemployees" :key="(getemployee.id,index)">
          <td>{{(((currentPage-1) * perPage)+index) + 1}}</td>
          <td>{{getemployee['name']}}</td>
          <td><a :href="`tel:${getemployee['phone']}`">{{getemployee['phone']}}</a></td>
          <td>{{getemployee['idNumber']}}</td>
          <td>{{getemployee['address']}}</td>
          <td>{{getemployee['role_id'] | role_id}}</td>
          <td>{{getemployee['salary'] | dinhdangtien | vietnamDong}}</td>
          <td>
            <b-button @click="sendid(getemployee['id'])" class="fix btn-sm" variant="success">Sửa</b-button>
          </td>
          <td>
            <b-button @click="showResetModal(getemployee.id)" variant="primary" class="mx-2 btn-sm">Đặt lại mật khẩu</b-button>
          </td>
          <td>
            <b-button v-if="getemployee.isActive==1" @click="showPermissionModal(getemployee.id)" variant="success" class="mx-2 btn-sm">Phân quyền</b-button>
          </td>
          <td>
            <b-button v-if="getemployee.isActive==0" @click="handleActive(getemployee.id)" class="btn-sm" variant="primary">Kích hoạt</b-button>
            <b-button v-if="getemployee.isActive==1" @click="handleInActive(getemployee.id)" class="btn-sm" variant="danger">Khoá</b-button>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <div class="d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        @change="getlistEmployee"
      ></b-pagination>
    </div>
    <!-- =============permission-modal============== -->
    <b-modal hide-footer title="Danh sách quyền nhân viên" ref="permission-modal">
      <div class="list-group mb-4">
        <div
          class="form-check form-switch py-2 text-start fs-5 mx-4 list-group-item"
          v-for="permission in permissions"
          :key="permission.id"
        >
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          :checked="permissionIds.includes(permission.id)"
          @change="updatePermission(permission.id)"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">{{permission.name}}</label>
        </div>
      </div>  
    </b-modal>
    <!-- =========modal-reset-password========= -->
    <b-modal title="Đặt lại mật khẩu" ref="modal-reset" hide-footer>
      <p class="mb-4">Bạn có chắc chắn muốn đạt lại mật khẩu ?</p>
      <div class="text-end">
        <b-button variant="success" class="mx-2 btn-sm" @click="hideResetModal">Hủy bỏ</b-button>
        <b-button variant="danger" class="btn-sm" @click="resetPassword">Đặt lại mật khẩu</b-button>
      </div>
    </b-modal>
    <!-- ==============update modal============ -->
    <b-modal v-model="showFix" hide-footer title="Sửa thông tin nhân viên">
      <form action="http://34.81.253.110/api/admin/employee" @submit.prevent="fix()">
        <div class="row align-items-center mt-4">
          <div class="col-md-7 col-12 mb-md-0 mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Họ và tên mới"
              v-model="fixEmployee.name"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.name"
            >{{ errors_fix.name[0] }}</div>
          </div>
          <div class="col-md-5 col-12">
            <input
              type="number"
              class="form-control"
              placeholder="Lương mới"
              v-model="fixEmployee.salary"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.salary"
            >Vui lòng nhập lương</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="tel"
              class="form-control"
              placeholder="Số điện thoại mới"
              v-model="fixEmployee.phone"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.phone"
            >{{ errors_fix.phone[0] }}</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="number"
              class="form-control"
              placeholder="Số CMTND/CCCD mới"
              v-model="fixEmployee.idNumber"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.idNumber"
            >Vui lòng nhập số CMTND/CCCD</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="text"
              class="form-control"
              placeholder="Địa chỉ mới"
              v-model="fixEmployee.address"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.address"
            >{{ errors_fix.address[0] }}</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <b-form-group label="Chọn vị trí mới" v-slot="{ ariaDescribedby }">
              <b-form-radio
                v-model="fixEmployee.role_id"
                :aria-describedby="ariaDescribedby"
                name="some-radios"
                value="2"
              >Nhân viên kho</b-form-radio>
              <b-form-radio
                v-model="fixEmployee.role_id"
                :aria-describedby="ariaDescribedby"
                name="some-radios"
                value="3"
              >Nhân viên văn phòng</b-form-radio>
            </b-form-group>
            <div
              class="text-danger"
              align="center"
              v-if="errors_fix !== null && errors_fix.role_id"
            >{{ errors_fix.role_id[0] }}</div>
          </div>
        </div>
        <div class="px-6 py-2">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Lưu</button>
        </div>
      </form>
    </b-modal>
    <!-- ==============register modal=============== -->
    <b-modal v-model="showregister" title="Đăng ký nhân viên" v-bind:hide-footer="true">
      <form action="http://34.81.253.110/api/admin/employee" @submit.prevent="register()">
        <div class="row align-items-center mt-4">
          <div class="col-md-7 col-12 mb-md-0 mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Họ và tên"
              v-model="registerEmployee.name"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.name"
            >{{ errors_register.name[0] }}</div>
          </div>
          <div class="col-md-5 col-12">
            <input
              type="number"
              class="form-control"
              placeholder="Lương"
              v-model="registerEmployee.salary"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.salary"
            >Vui lòng nhập lương</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col-md-6 col-12 mb-md-0 mb-2">
            <input
              type="tel"
              class="form-control"
              placeholder="Số điện thoại"
              v-model="registerEmployee.phone"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.phone"
            >{{ errors_register.phone[0] }}</div>
          </div>
          <div class="col-md-6 col-12">
            <input
              type="number"
              class="form-control"
              placeholder="Số CMTND/CCCD"
              v-model="registerEmployee.idNumber"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.idNumber"
            >Vui lòng nhập số CMTND/CCCD</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <input
              type="text"
              class="form-control"
              placeholder="Địa chỉ"
              v-model="registerEmployee.address"
            />
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.address"
            >{{ errors_register.address[0] }}</div>
          </div>
        </div>
        <div class="row align-items-center mt-4">
          <div class="col">
            <b-form-group label="Chọn vị trí" v-slot="{ ariaDescribedby }">
              <b-form-radio
                v-model="registerEmployee.role_id"
                :aria-describedby="ariaDescribedby"
                name="some-radios"
                value="2"
              >Nhân viên kho</b-form-radio>
              <b-form-radio
                v-model="registerEmployee.role_id"
                :aria-describedby="ariaDescribedby"
                name="some-radios"
                value="3"
              >Nhân viên văn phòng</b-form-radio>
            </b-form-group>
            <div
              class="text-danger"
              align="center"
              v-if="errors_register !== null && errors_register.role_id"
            >{{ errors_register.role_id[0] }}</div>
          </div>
        </div>
        <div class="px-5 py-2">
          <button type="submit" class="btn btn-primary btn-sm" align="center">Thêm</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import BaseRequest from "@/store/BaseRequest.js";
export default {
  created: function() {
    this.getlistEmployee(1);
  },
  filters: {
    vietnamDong(sotien) {
      return sotien + " VND";
    },
    dinhdangtien(sotien) {
      return sotien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    role_id(id) {
      if (id == 2) {
        return "Nhân viên kho";
      }
      if (id == 3) {
        return "Nhân viên văn phòng";
      }
    }
  },
  data() {
    return {
      getemployees: null,
      registerEmployee: {
        name: null,
        salary: null,
        phone: null,
        idNumber: null,
        address: null,
        role_id: null
      },
      errors_register: null,
      errors_fix: null,
      employee_id: null,
      fixEmployee: {
        name: null,
        salary: null,
        phone: null,
        idNumber: null,
        address: null,
        role_id: null
      },
      fix_success: false,
      register_success: false,
      active:null,
      currentPage: 1,
      rows: 3,
      perPage: 40,
      showFix: false,
      showregister: false,
      cancel_success: false,
      resetPasswordSuccess: false,
      loading:false,
      permissions: null,
      permissionsOfUser: [],
      selected: [],
      isChecked: [],
    };
  },
  computed: {
    permissionIds() {
      return this.permissionsOfUser.map(({ id }) => id);
    }
  },
  watch: {
    permissionIds(value) {
      this.isChecked = value.map(({ id }) => id);
    }
  },
  methods: {
    getlistEmployee: function(page) {
      this.loading = true;
      BaseRequest.get("/admin/employee?per_page=" + this.perPage, {
        page
      }).then(response => {
        this.loading = false;
        this.getemployees = response.data.data;
        this.currentPage = response.data.current_page;
        this.rows = response.data.total;
      });
    },
    register: function() {
      BaseRequest.post("/admin/employee", this.registerEmployee)
        .then(() => {
          this.showregister = false;
          setTimeout(() => {
            this.register_success = false;
          }, 1000);
          this.register_success = true;
          this.registerEmployee.name = null;
          this.registerEmployee.salary = null;
          this.registerEmployee.phone = null;
          this.registerEmployee.idNumber = null;
          this.registerEmployee.address = null;
          this.registerEmployee.role_id = null;
          this.errors_register = null;
          this.getlistEmployee(this.currentPage);
        })
        .catch(error => {
          this.errors_register = error.response.data.errors;
        });
    },
    sendid: function(id) {
      this.employee_id = id;
      BaseRequest.get("/admin/employee/" + id + "/edit")
      .then(response => {
        this.fixEmployee = response.data;
        this.showFix = true;
        setTimeout(() => {
            this.register_success = false;
          }, 1000);
        this.errors_fix = null

      });
    },
    fix: function() {
      BaseRequest.put("/admin/employee/" + this.employee_id, this.fixEmployee)
        .then(() => {
          this.showFix = false;
          setTimeout(() => {
            this.fix_success = false;
          }, 1000);
          this.fix_success = true;
          this.fixEmployee.name = null;
          this.fixEmployee.salary = null;
          this.fixEmployee.phone = null;
          this.fixEmployee.idNumber = null;
          this.fixEmployee.address = null;
          this.fixEmployee.role_id = null;
          this.errors_fix = null;
          this.getlistEmployee(this.currentPage);
        })
        .catch(error => {
          this.errors_fix = error.response.data.errors;
        });
    },
    showPermissionModal(id) {
      this.employee_id = id;
      this.$refs["permission-modal"].show();
      BaseRequest.get("/admin/permissions/" + id)
      .then(response => {
      this.permissions = response.data;
      BaseRequest.get("/admin/permissions-of-user/" + this.employee_id)
      .then(response => {
        this.permissionsOfUser = response.data.permissions;
      });
      });
    },
    hidePermissionModal() {
      this.$refs["permission-modal"].hide();
    },
    updatePermission(id) {
      BaseRequest.put("/admin/permissions/" + this.employee_id + "/" + id)
      .then(() => {
        BaseRequest.get("/admin/permissions/" + this.employee_id).then(response => {
          this.permissions = response.data;
        });
      });
    },
    handleActive(id) {
      BaseRequest.put("/admin/employee/active-inactive/" + id).then(() => {
        this.getlistEmployee();
      })
    },
    handleInActive(id) {
      BaseRequest.put("/admin/employee/active-inactive/" + id).then(() => {
        this.getlistEmployee();
      })
    },
    showResetModal(id) {
      this.employee_id = id;
      this.$refs["modal-reset"].show();
    },
    hideResetModal() {
      this.$refs["modal-reset"].hide();
    },
    resetPassword() {
      BaseRequest.put(
        "/admin/employee/reset-password/" + this.employee_id
      ).then(() => {
        this.$refs["modal-reset"].hide();
        setTimeout(() => {
          this.resetPasswordSuccess = false;
        }, 1000);
        this.resetPasswordSuccess = true;
      });
    },
     hasHistory () { return window.history.length > 2 }
  }
};
</script>

<style scoped>
.btn-submit {
  padding: 0px auto !important;
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
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.px-5 {
  padding-right: 11.6rem !important;
  padding-left: 11.6rem !important;
}
.px-6 {
  padding-right: 12.8rem !important;
  padding-left: 12.8rem !important;
}
span {
  font-size: 18px;
}
.button_register_employee {
  margin-bottom: 20px;
}
.form-check-input {
  right: 0 !important;
  margin-right: 20px;
}
.form-check-label {
  max-width: 80%;
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
	td:nth-of-type(2):before { content: "Họ tên"; }
	td:nth-of-type(3):before { content: "Số điện thoại"; }
	td:nth-of-type(4):before { content: "Số CMT/CCCD"; }
	td:nth-of-type(5):before { content: "Địa chỉ"; }
  td:nth-of-type(6):before { content: "Vị trí"; }
	td:nth-of-type(7):before { content: "Mức lương"; }
  td:nth-of-type(8):before { content: ""; }
}
</style>