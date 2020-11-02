import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'
import permission from 'nativescript-permissions'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

permission.requestPermission([
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
], "Autorisation d'enregistrer les pdf")
.then(function (res) {
  console.log('authorised');
})
.catch(function (err) {
  console.log(err);
});

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
