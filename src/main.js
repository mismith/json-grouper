import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import Spinner from '@/components/Spinner';

import App from './App';

Vue.prototype.EventBus = new Vue();
Vue.config.productionTip = false;
Vue.use(VueMaterial);
Vue.component('md-spinner', Spinner);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
