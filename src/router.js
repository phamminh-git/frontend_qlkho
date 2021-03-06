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
  { path: '/login', component: Login, name: 'Login', meta: {title: '????ng nh???p'} },
  {
    path: '/dashboardadmin/', component: DashboardAdmin, name: 'DashboardAdmin', meta: {title: 'Trang ch???'}, 
    children: [
      { path: 'nhanvien', component: Nhanvien, name: 'Nhanvien' , meta: {title: 'Nh??n vi??n'}},
      { path: 'xacnhandonhang', component: Xacnhandonhang, name: 'Xacnhandonhang', meta: {title: 'Nh???p kho m???t h??ng'}},
      { path: 'danhsachnhaxe', component: Danhsachnhaxe, name: 'Danhsachnhaxe' , meta: {title: 'Danh s??ch nh?? xe'}},
      { path: 'xephanglenxe', component: Xephanglenxe, name: 'Xephanglenxe', meta: {title: 'X???p h??ng l??n xe'}},
      { path: 'danhsachnhaxe/danhsachcacxe/:id', component: Danhsachcacxe, name: 'Danhsachcacxe', props: true , meta: {title: 'Danh s??ch c??c xe'}},
      { path: 'chiphidichuyen/', component: ChiPhiCauDuong, name: 'ChiPhiCauDuong', meta: {title: 'Chi ph?? xe'}},
      { path: 'chiphidichuyen/chitietchiphi/:id/:licensePlate', component: ChiTietChiPhi, name: 'ChiTietChiPhi', props: true, meta: {title: 'Chi ti???t chi ph??'}},
      { path: 'danhsachmathangtonkho/', component: Danhsachmathang, name: 'Danhsachmathang' , meta: {title: 'Danh s??ch m???t h??ng'}},
      { path: 'danhsachmathangtonkho/thongtindonhang/:id', component: Thongtindonhang, name: 'Thongtindonhang', props: true , meta: {title: 'Th??ng tin ????n h??ng'}},
      { path: 'quanlidonhang/donhangchuanhan', component: Donhangchuanhan, name: 'Donhangchuanhan' , meta: {title: '????n h??ng ch??a nh???n'}},
      { path: 'quanlidonhang/donhangdanhan', component: Donhangdanhan, name: 'Donhangdanhan' , meta: {title: '????n h??ng ???? nh???n'}},
      { path: 'quanlidonhang/donhangdagiao', component: Donhangdagiao, name: 'Donhangdagiao' , meta: {title: '????n h??ng ???? giao'}},
      { path: 'quanlidonhang/taodonhang', component: Taodonhang, name: 'Taodonhang' , meta: {title: 'T???o ????n h??ng'}},
      { path: 'quanlidonhang/donhangchuanhan/:id', component: Chitietdonhangchuanhan, name: 'Chitietdonhangchuanhan', props: true, meta: {title: 'Chi ti???t ????n h??ng ch??a nh???n'}},
      { path: 'quanlidonhang/donhangdanhan/:id', component: Chitietdonhangdanhan, name: 'Chitietdonhangdanhan', props: true, meta: {title: 'Chi ti???t ????n h??ng ???? nh???n'}},
      { path: 'quanlidonhang/donhangdagiao/:id', component: Chitietdonhangdagiao, name: 'Chitietdonhangdagiao', props: true, meta: {title: 'Chi ti???t ????n h??ng ???? giao'}},


      { path: '/dashboardadmin/doanhthu', component: Doanhthu, name: 'Doanhthu', meta: {title: 'Doanh thu'},
        children:[
          { path: 'danhsachdonhang', component: Danhsachdonhang, name: 'Danhsachdonhang', props:true , meta: {title: 'Danh s??ch ????n h??ng'}},
          { path: 'danhsachmathangxeplenxe', component: Danhsachmathangxeplenxe, name: 'Danhsachmathangxeplenxe', props:true , meta: {title: 'Danh s??ch m???t h??ng x???p l??n xe'}},
          { path: 'danhsachchiphi', component: Danhsachchiphi, name: 'Danhsachchiphi', props:true , meta: {title: 'Danh s??ch chi ph??'}},
        ] },

      { path: '/dashboardadmin/thanhtoantienthuho/donhangdathanhtoan', component: Donhangdathanhtoan, name: 'Donhangdathanhtoan' , meta: {title: '????n h??ng ???? thanh to??n'}},
      { path: '/dashboardadmin/thanhtoantienthuho/donhangchuathanhtoan', component: Donhangchuathanhtoan, name: 'Donhangchuathanhtoan' , meta: {title: '????n h??ng ch??a thanh to??n'}},
      { path: '/dashboardadmin/congnochuathanhtoan/congnonhaxe', component: Congnonhaxechuathanhtoan, name: 'Congnonhaxechuathanhtoan' , meta: {title: 'C??ng n??? nh?? xe'}},
      { path: '/dashboardadmin/congnodathanhtoan/congnonhaxe', component: Congnonhaxedathanhtoan, name: 'Congnonhaxedathanhtoan' , meta: {title: 'C??ng n??? nh?? xe'}},

      { path: '/dashboardadmin/congnochuathanhtoan/congnonhaxe/congnocacxe/:id', component: Congnocacxechuathanhtoan, name: 'Congnocacxechuathanhtoan', props: true , meta: {title: 'C??ng n??? c??c xe'}},
      { path: '/dashboardadmin/congnodathanhtoan/congnonhaxe/congnocacxe/:id', component: Congnocacxedathanhtoan, name: 'Congnocacxedathanhtoan', props: true , meta: {title: 'C??ng n??? c??c xe'}},
      { path: '/dashboardadmin/congnonhaxe/congnocacxe/xacnhantienthuhodathanhtoan/:id', component: Xacnhantienthuhodathanhtoan, name: 'Xacnhantienthuhodathanhtoan', props: true , meta: {title: 'X??c nh???n ti???n thu h???'}},
      { path: '/dashboardadmin/congnonhaxe/congnocacxe/xacnhantienthuhochuathanhtoan/:id', component: Xacnhantienthuhochuathanhtoan, name: 'Xacnhantienthuhochuathanhtoan', props: true , meta: {title: 'X??c nh???n ti???n thu h???'}},

      { path: '/dashboardadmin/lichsuhoatdong', component: Lichsuhoatdong, name: 'Lichsuhoatdong' , meta: {title: 'L???ch s??? ho???t ?????ng'}},
      { path: '/dashboardadmin/lichsuhoatdong/danhsachlichsu', component: Danhsachlichsu, name: 'Danhsachlichsu', props: true , meta: {title: 'Danh s??ch l???ch s???'}},


      { path: '/dashboardadmin/hangdangtrenxe/', component: Hangdangtrenxe, name: 'Hangdangtrenxe', meta: {title: 'H??ng ??ang tr??n xe'}},
      { path: '/dashboardadmin/hangdangtrenxe/chitietdonhang/:id', component: Chitietdonhang, name: 'Chitietdonhang', props:true, meta: {title: 'Chi ti???t ????n h??ng'}},


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
