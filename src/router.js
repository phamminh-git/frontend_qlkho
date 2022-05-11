import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Login from './components/Dangnhap/Login'
import DashboardAdmin from './components/Quanly/DashboardAdmin'
import Nhanvien from './components/Quanly/Nhanvien/Nhanvien'
import Xacnhandonhang from './components/Quanly/Kiemtramathang/Xacnhandonhang'
import Xephanglenxe from './components/Quanly/Giaohang/Xephanglenxe'
import Danhsachnhaxe from './components/Quanly/Quanlynhaxe/Danhsachnhaxe'
import Danhsachcacxe from './components/Quanly/Quanlynhaxe/Danhsachcacxe'
import ChiPhiCauDuong from './components/Quanly/Quanlychiphi/ChiPhiCauDuong'
import ChiTietChiPhi from './components/Quanly/Quanlychiphi/ChiTietChiPhi'
import Danhsachmathang from './components/Quanly/Quanlytonkho/Danhsachmathang'
import Thongtindonhang from './components/Quanly/Quanlytonkho/Thongtindonhang'
import Donhangchuanhan from './components/Quanly/Quanlydonhang/Donhangchuanhan'
import Donhangdanhan from './components/Quanly/Quanlydonhang/Donhangdanhan'
import Donhangdagiao from './components/Quanly/Quanlydonhang/Donhangdagiao'
import Taodonhang from './components/Quanly/Quanlydonhang/Taodonhang'
import Chitietdonhangchuanhan from './components/Quanly/Quanlydonhang/Chitietdonhang/Chitietdonhangchuanhan'
import Chitietdonhangdanhan from './components/Quanly/Quanlydonhang/Chitietdonhang/Chitietdonhangdanhan'
import Chitietdonhangdagiao from './components/Quanly/Quanlydonhang/Chitietdonhang/Chitietdonhangdagiao'

import Donhangdathanhtoan from './components/Quanly/Thanhtoantienthuho/Donhangdathanhtoan'
import Donhangchuathanhtoan from './components/Quanly/Thanhtoantienthuho/Donhangchuathanhtoan'
import Congnonhaxedathanhtoan from './components/Quanly/Quanlycongno/Congnodathanhtoan/Congnonhaxe'
import Congnocacxedathanhtoan from './components/Quanly/Quanlycongno/Congnodathanhtoan/Congnocacxe'
import Congnonhaxechuathanhtoan from './components/Quanly/Quanlycongno/Congnochuathanhtoan/Congnonhaxe'
import Congnocacxechuathanhtoan from './components/Quanly/Quanlycongno/Congnochuathanhtoan/Congnocacxe'
import Xacnhantienthuhochuathanhtoan from './components/Quanly/Quanlycongno/Congnochuathanhtoan/Xacnhantienthuho'
import Xacnhantienthuhodathanhtoan from './components/Quanly/Quanlycongno/Congnodathanhtoan/Xacnhantienthuho'


import Doanhthu from './components/Quanly/Doanhthu/Doanhthu'
import Danhsachdonhang from './components/Quanly/Doanhthu/Danhsachdonhang/Danhsachdonhang'
import Danhsachmathangxeplenxe from './components/Quanly/Doanhthu/Danhsachmathangxeplenxe/Danhsachmathangxeplenxe'
import Danhsachchiphi from './components/Quanly/Doanhthu/Danhsachchiphi/Danhsachchiphi'


import Lichsuhoatdong from './components/Quanly/Lichsuhoatdong/Lichsuhoatdong'
import Danhsachlichsu from './components/Quanly/Lichsuhoatdong/Danhsachlichsu'



import Hangdangtrenxe from './components/Quanly/Quanlymathangtrenxe/Hangdangtrenxe'
import Chitietdonhang from './components/Quanly/Quanlymathangtrenxe/Chitietdonhang'


const routes = [
  { path: '/', redirect: {name: 'DashboardAdmin'}},
  { path: '/login', component: Login, name: 'Login', meta: {title: 'Đăng nhập'} },
  {
    path: '/dashboardadmin/', component: DashboardAdmin, name: 'DashboardAdmin', meta: {title: 'Trang chủ'}, 
    children: [
      { path: 'nhanvien', component: Nhanvien, name: 'Nhanvien' , meta: {title: 'Nhân viên'}},
      { path: 'xacnhandonhang', component: Xacnhandonhang, name: 'Xacnhandonhang', meta: {title: 'Nhập kho mặt hàng'}},
      { path: 'danhsachnhaxe', component: Danhsachnhaxe, name: 'Danhsachnhaxe' , meta: {title: 'Danh sách nhà xe'}},
      { path: 'xephanglenxe', component: Xephanglenxe, name: 'Xephanglenxe', meta: {title: 'Xếp hàng lên xe'}},
      { path: 'danhsachnhaxe/danhsachcacxe/:id', component: Danhsachcacxe, name: 'Danhsachcacxe', props: true , meta: {title: 'Danh sách các xe'}},
      { path: 'chiphidichuyen/', component: ChiPhiCauDuong, name: 'ChiPhiCauDuong', meta: {title: 'Chi phí xe'}},
      { path: 'chiphidichuyen/chitietchiphi/:id/:licensePlate', component: ChiTietChiPhi, name: 'ChiTietChiPhi', props: true, meta: {title: 'Chi tiết chi phí'}},
      { path: 'danhsachmathangtonkho/', component: Danhsachmathang, name: 'Danhsachmathang' , meta: {title: 'Danh sách mặt hàng'}},
      { path: 'danhsachmathangtonkho/thongtindonhang/:id', component: Thongtindonhang, name: 'Thongtindonhang', props: true , meta: {title: 'Thông tin đơn hàng'}},
      { path: 'quanlidonhang/donhangchuanhan', component: Donhangchuanhan, name: 'Donhangchuanhan' , meta: {title: 'Đơn hàng chưa nhận'}},
      { path: 'quanlidonhang/donhangdanhan', component: Donhangdanhan, name: 'Donhangdanhan' , meta: {title: 'Đơn hàng đã nhận'}},
      { path: 'quanlidonhang/donhangdagiao', component: Donhangdagiao, name: 'Donhangdagiao' , meta: {title: 'Đơn hàng đã giao'}},
      { path: 'quanlidonhang/taodonhang', component: Taodonhang, name: 'Taodonhang' , meta: {title: 'Tạo đơn hàng'}},
      { path: 'quanlidonhang/donhangchuanhan/:id', component: Chitietdonhangchuanhan, name: 'Chitietdonhangchuanhan', props: true, meta: {title: 'Chi tiết đơn hàng chưa nhận'}},
      { path: 'quanlidonhang/donhangdanhan/:id', component: Chitietdonhangdanhan, name: 'Chitietdonhangdanhan', props: true, meta: {title: 'Chi tiết đơn hàng đã nhận'}},
      { path: 'quanlidonhang/donhangdagiao/:id', component: Chitietdonhangdagiao, name: 'Chitietdonhangdagiao', props: true, meta: {title: 'Chi tiết đơn hàng đã giao'}},


      { path: '/dashboardadmin/doanhthu', component: Doanhthu, name: 'Doanhthu', meta: {title: 'Doanh thu'},
        children:[
          { path: 'danhsachdonhang', component: Danhsachdonhang, name: 'Danhsachdonhang', props:true , meta: {title: 'Danh sách đơn hàng'}},
          { path: 'danhsachmathangxeplenxe', component: Danhsachmathangxeplenxe, name: 'Danhsachmathangxeplenxe', props:true , meta: {title: 'Danh sách mặt hàng xếp lên xe'}},
          { path: 'danhsachchiphi', component: Danhsachchiphi, name: 'Danhsachchiphi', props:true , meta: {title: 'Danh sách chi phí'}},
        ] },

      { path: '/dashboardadmin/thanhtoantienthuho/donhangdathanhtoan', component: Donhangdathanhtoan, name: 'Donhangdathanhtoan' , meta: {title: 'Đơn hàng đã thanh toán'}},
      { path: '/dashboardadmin/thanhtoantienthuho/donhangchuathanhtoan', component: Donhangchuathanhtoan, name: 'Donhangchuathanhtoan' , meta: {title: 'Đơn hàng chưa thanh toán'}},
      { path: '/dashboardadmin/congnochuathanhtoan/congnonhaxe', component: Congnonhaxechuathanhtoan, name: 'Congnonhaxechuathanhtoan' , meta: {title: 'Công nợ nhà xe'}},
      { path: '/dashboardadmin/congnodathanhtoan/congnonhaxe', component: Congnonhaxedathanhtoan, name: 'Congnonhaxedathanhtoan' , meta: {title: 'Công nợ nhà xe'}},

      { path: '/dashboardadmin/congnochuathanhtoan/congnonhaxe/congnocacxe/:id', component: Congnocacxechuathanhtoan, name: 'Congnocacxechuathanhtoan', props: true , meta: {title: 'Công nợ các xe'}},
      { path: '/dashboardadmin/congnodathanhtoan/congnonhaxe/congnocacxe/:id', component: Congnocacxedathanhtoan, name: 'Congnocacxedathanhtoan', props: true , meta: {title: 'Công nợ các xe'}},
      { path: '/dashboardadmin/congnonhaxe/congnocacxe/xacnhantienthuhodathanhtoan/:id', component: Xacnhantienthuhodathanhtoan, name: 'Xacnhantienthuhodathanhtoan', props: true , meta: {title: 'Xác nhận tiền thu hộ'}},
      { path: '/dashboardadmin/congnonhaxe/congnocacxe/xacnhantienthuhochuathanhtoan/:id', component: Xacnhantienthuhochuathanhtoan, name: 'Xacnhantienthuhochuathanhtoan', props: true , meta: {title: 'Xác nhận tiền thu hộ'}},

      { path: '/dashboardadmin/lichsuhoatdong', component: Lichsuhoatdong, name: 'Lichsuhoatdong' , meta: {title: 'Lịch sử hoạt động'}},
      { path: '/dashboardadmin/lichsuhoatdong/danhsachlichsu', component: Danhsachlichsu, name: 'Danhsachlichsu', props: true , meta: {title: 'Danh sách lịch sử'}},


      { path: '/dashboardadmin/hangdangtrenxe/', component: Hangdangtrenxe, name: 'Hangdangtrenxe', meta: {title: 'Hàng đang trên xe'}},
      { path: '/dashboardadmin/hangdangtrenxe/chitietdonhang/:id', component: Chitietdonhang, name: 'Chitietdonhang', props:true, meta: {title: 'Chi tiết đơn hàng'}},


    ]
  },
]
const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  let excludePages = ['/login']
  let requiredLogin = !excludePages.includes(to.path)
  let user = JSON.parse(localStorage.getItem('user'))
  if (requiredLogin && !user) {
    next({ name: 'Login' })
  }
  else next();
})

export default router
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }
  
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  
  if(!nearestWithMeta) return next();
  
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');
  
    Object.keys(tagDef).forEach(key => {
    tag.setAttribute(key, tagDef[key]);
    });
  
    tag.setAttribute('data-vue-router-controlled', '');
  
    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));
  
  next();
  });
