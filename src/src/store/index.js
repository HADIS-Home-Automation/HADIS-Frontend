import Vuex from 'vuex';
import Vue from 'vue';
import messages from './modules/messages'

// vuex state manager init

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {messages}
});