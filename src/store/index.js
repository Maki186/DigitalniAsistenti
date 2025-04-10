import { createStore } from 'vuex'
import auth from './auth'
import cart from './cart'

export default createStore({
  modules: {
    auth,
    cart
  }
}) 