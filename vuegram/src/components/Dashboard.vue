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
        <div v-if="posts.length">
          <div :key="index" v-for="(post, index) in posts" class="post">
            <h5>{{ post.userName }}</h5>
            <span>{{ post.createdOn | formatDate }}</span>
            <p>{{ post.content | trimLength }}</p>
            <ul>
              <li><a>comments {{ posts.comments }}</a></li>
              <li><a>likes {{ posts.likes}}</a></li>
              <li><a>vie full post</a></li>
            </ul>

          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
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
    ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
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
  },
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength (val) {
      if (val.length < 200) { return val }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>

<style scoped>

</style>
