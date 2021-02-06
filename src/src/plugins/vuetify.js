import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css"

// vuetify design plugin init

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#1976D2',
                secondary: '#FFC107',
            },
        },
    },
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
});
