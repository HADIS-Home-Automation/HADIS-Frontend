import Vue from "vue";
import Vuetify from "vuetify/lib";

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
});
