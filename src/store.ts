import Vue from "vue";
import Vuex from "vuex";
import * as AppSettings from "@nativescript/core/application-settings";

Vue.use(Vuex);

const dob = AppSettings.getString('dob');

const state = {
  name: AppSettings.getString('name') ?? "",
  lastname:  AppSettings.getString('lastname') ?? "",
  dob: dob ? new Date(dob) : new Date(Date.now()),
  tob: AppSettings.getString('tob') ?? "",
  town: AppSettings.getString('town') ?? "",
  postalc: AppSettings.getString('postalc') ?? "",
  adress: AppSettings.getString('adress') ?? "",
  motif: AppSettings.getString('motif') ?? "",
};

export default new Vuex.Store({
  state,
  mutations: {
    updateField (state, payload) {
      if(payload.field){
        state[payload.field] = payload.value
      }
      if(typeof payload.value === 'string'){
        AppSettings.setString(payload.field, payload.value)
        return;
      }
      if(payload.value instanceof Date){
        console.log('payload', payload);
        AppSettings.setString(payload.field, String(payload.value))
      }
    }
  },
  actions: {},
});
