import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

import { Modal } from 'bootstrap-vue/es/components';
import { Navbar } from 'bootstrap-vue/es/components';
import { Alert } from 'bootstrap-vue/es/components';
import { Collapse } from 'bootstrap-vue/es/components';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(Navbar);
Vue.use(Modal);
Vue.use(Alert);
Vue.use(Collapse);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})