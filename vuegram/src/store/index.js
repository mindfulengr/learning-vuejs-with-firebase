import Vue from 'vue'
import Vuex from 'vuex'

const fb = require('../firebaseConfig')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
  }

  // realtime updates from our posts collection
  fb.postsCollection.orderBy('createdOn', 'desc')
    .onSnapshot(querySnapshot => {
      // check if created by currentUser
      let createdByCurrentUser
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges()[0].doc.data().userId
      }

      // add new posts to hiddenPosts after initial load
      if (
        querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type === 'added' &&
        !createdByCurrentUser
      ) {
        let post = querySnapshot.docChanges()[0].doc.data()
        post.id = querySnapshot.docChanges()[0].doc.id
        store.commit('setHiddenPosts', post)
      } else {
        let posts = []
        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          posts.push(post)
        })
        store.commit('setPosts', posts)
      }
    })
})

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: []
  },
  actions: {
    clearData ({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setPosts', null)
    },
    fetchUserProfile ({ commit, state }) {
      fb.usersCollection.doc(state.currentUser.uid).get()
        .then(res => {
          commit('setUserProfile', res.data())
        }).catch(err => {
          console.log(err)
        })
    }
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setUserProfile (state, val) {
      state.userProfile = val
    },
    setPosts (state, val) {
      state.posts = val
    },
    setHiddenPosts (state, val) {
      if (val) {
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val)
        }
      } else {
        state.hiddenPosts = []
      }
    }
  },
  modules: {}
})

export default store
