import { createStore } from 'vuex';
import links from './modules/links';

export default createStore({
  modules: {
    links
  },
});
