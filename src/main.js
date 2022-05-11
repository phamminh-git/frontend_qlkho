import Vue from 'vue'
import App from './App.vue'
import vueDebounce from 'vue-debounce'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment';


Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
});
Vue.use(vueDebounce)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(vueDebounce)
Vue.config.productionTip = false

// store
import store from '@/store'
import router from './router'
import axios from 'axios'

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')

axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
        if (error.response.status === 401) {
            localStorage.removeItem('user')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)