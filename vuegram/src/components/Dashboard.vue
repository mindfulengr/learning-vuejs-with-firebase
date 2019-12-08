<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }} </h5>
          <p>{{ userProfile.title }} </p>
          <div class="create-post">
            <label for="textarea">create a post</label>
            <form @submit.prevent>
              <textarea id="textarea" v-model.trim="post.content"/>
              <button @click='createPost' :disabled="post.content === ''" class="button">post</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const fb = require('../firebaseConfig')

export default {
  name: 'Dashboard',
  data () {
    return {
      post: {
        content: ''
      }
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser'])
  },
  methods: {
    createPost () {
      fb.postsCollection.add({
        createdOn: new Date(),
        content: this.post.content,
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        comments: 0,
        likes: 0
      }).then(() => {
        this.post.content = ''
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
