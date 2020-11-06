
// vuex mqtt message storage
const state = {
    mqttMessage: []
};

// set the storage message mutation function
const mutations = {
    setMessage: (state, mqttMessage) => (state.mqttMessage = mqttMessage)
};


export default {state, mutations};