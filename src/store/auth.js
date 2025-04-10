export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    userName: '',
    userEmail: '',
    registeredUsers: []
  },
  mutations: {
    setLoginState(state, { isLoggedIn, userName, email }) {
      state.isLoggedIn = isLoggedIn
      state.userName = userName
      state.userEmail = email
    },
    logout(state) {
      state.isLoggedIn = false
      state.userName = ''
      state.userEmail = ''
    },
    registerUser(state, { name, email, password }) {
      // Přidání nového uživatele do seznamu
      state.registeredUsers.push({ name, email, password })
      // Uložení do localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers))
    },
    loadRegisteredUsers(state) {
      const savedUsers = localStorage.getItem('registeredUsers')
      if (savedUsers) {
        state.registeredUsers = JSON.parse(savedUsers)
      }
    }
  },
  actions: {
    login({ commit, state }, { email, password }) {
      // Hledání uživatele v registrovaných uživatelích
      const user = state.registeredUsers.find(u => u.email === email && u.password === password)
      
      if (user) {
        commit('setLoginState', { 
          isLoggedIn: true, 
          userName: user.name,
          email: user.email
        })
        localStorage.setItem('loginState', JSON.stringify({
          isLoggedIn: true,
          userName: user.name,
          email: user.email
        }))
        return true
      } else {
        return false
      }
    },
    register({ commit }, { name, email, password }) {
      commit('registerUser', { name, email, password })
      return true
    },
    logout({ commit }) {
      commit('logout')
      localStorage.removeItem('loginState')
    },
    initializeAuth({ commit }) {
      console.log('Initializing auth...')
      // Načtení registrovaných uživatelů
      commit('loadRegisteredUsers')
      
      // Načtení stavu přihlášení
      const savedLoginState = localStorage.getItem('loginState')
      if (savedLoginState) {
        const loginData = JSON.parse(savedLoginState)
        commit('setLoginState', { 
          isLoggedIn: loginData.isLoggedIn, 
          userName: loginData.userName,
          email: loginData.email
        })
      }
    }
  }
} 