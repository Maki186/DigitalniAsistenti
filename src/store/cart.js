export default {
  namespaced: true,
  state: {
    items: []
  },
  mutations: {
    addToCart(state, item) {
      console.log('Přidávám položku do košíku:', item)
      const existingItem = state.items.find(i => i.id === item.id)
      if (existingItem) {
        console.log('Položka již existuje, aktualizuji množství')
        existingItem.quantity += item.quantity
      } else {
        console.log('Přidávám novou položku')
        state.items.push({ ...item })
      }
      console.log('Aktuální stav košíku:', state.items)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateQuantity(state, { id, quantity }) {
      const item = state.items.find(i => i.id === id)
      if (item) {
        item.quantity = quantity
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    removeFromCart(state, id) {
      state.items = state.items.filter(item => item.id !== id)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cartItems')
    },
    initializeCart(state) {
      const savedCartItems = localStorage.getItem('cartItems')
      if (savedCartItems) {
        state.items = JSON.parse(savedCartItems)
      }
    }
  },
  actions: {
    addToCart({ commit }, item) {
      console.log('Volám akci addToCart s položkou:', item)
      commit('addToCart', item)
    },
    updateQuantity({ commit }, payload) {
      commit('updateQuantity', payload)
    },
    removeFromCart({ commit }, id) {
      commit('removeFromCart', id)
    },
    clearCart({ commit }) {
      commit('clearCart')
    },
    initializeCart({ commit }) {
      commit('initializeCart')
    }
  },
  getters: {
    cartItems: state => state.items,
    cartTotal: state => {
      return state.items.reduce((total, item) => {
        if (item.price === 'Zdarma') {
          return total
        }
        const price = parseInt(item.price.replace(/[^\d]/g, ''))
        return total + (price * item.quantity)
      }, 0)
    },
    cartItemCount: state => state.items.reduce((count, item) => count + item.quantity, 0)
  }
} 