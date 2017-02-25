<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <div class="content">
            <button class="button" @click="postUpdateArticle()">Cập nhập</button>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">

      <div class="tile is-vertical is-6 ">
        <div class="tile is-parent">
          <article class="tile is-child box ">
            <div class="content">
              <div class="block">
                <label class="label">Title</label>
                <p class="control">
                  <input type="text" class="input" v-model="article.title" @input="autoCreateSlug">
                </p>
                <label class="label">Slug</label>
                <p class="control">
                  <input type="text" class="input" v-model="article.slug">
                </p>
                <label class="checkbox">
                  <input type="checkbox" v-model="autoSlug">
                  Auto create slug
                </label>
                <label class="label">Description</label>
                <p class="control">
                  <textarea id="" cols="30" rows="10" class="textarea" v-model="article.description"></textarea>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-vertical is-6 ">
        <div class="tile is-parent">
          <article class="tile is-child box ">
            <div class="content">
              <div class="block">
                <label class="label">Categories</label>
                <multiselect v-model="article.categories" :options="option_categories" :multiple="true" :close-on-select="false" :clear-on-select="true"  :hide-selected="true" placeholder="Pick some" label="title" track-by="slug"></multiselect>
                <label class="label">Tags</label>
                <multiselect v-model="article.tags" tag-placeholder="Add this as new tag" placeholder="Add a tag" label="name" track-by="slug" :options="option_tags" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="tile is-ancestor">

      <div class="tile is-vertical is-6 ">
        <div class="tile is-parent">
          <article class="tile is-child box ">
            <div class="content">
              <div class="block">
                <label class="label" >Content</label>
                <textarea cols="30" rows="10" class="textarea" :value="article.content" @input="update"></textarea>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-vertical is-6 ">
        <div class="tile is-parent">
          <article class="tile is-child box ">
            <div class="content">
              <div class="block">
                <label>Preview content</label>
                <div v-html="compiledMarkdown">
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
Vue.component(Multiselect)
import marked from 'marked'
import _ from 'lodash'
import slug from 'slug'
import Notification from 'vue-bulma-notification'

const NotificationComponent = Vue.extend(Notification)

const openNotification = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 4500,
  container: '.notifications'
}) => {
  return new NotificationComponent({
    el: document.createElement('div'),
    propsData
  })
}

export default {
  components: {
    Multiselect
  },
  data () {
    return {
      autoSlug: true,
      article: {
        content: ''
      },
      option_tags: [
      ],
      option_categories: [
      ],
      baseUrl: this.$store.state.pkg.apiUrl
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.article.content, { sanitize: true })
//      return ''
    }
  },
  created: function () {
    this.getCategories()
    this.getArticle()
  },
  beforeMount: function () {
  },
  methods: {
    update: _.debounce(function (e) {
      this.article.content = e.target.value
    }, 100),

    addTag (newTag) {
      const tag = {
        name: newTag,
        slug: slug(newTag, {lower: true})
      }
      this.article.tags.push(tag)
    },

    getCategories () {
      this.$http.get(this.baseUrl + '/api/category/get')
        .then(res => {
          this.option_categories = res.data
        }).catch(err => {
          console.log(err)
        })
    },
    getArticle () {
      this.$http.get(this.baseUrl + '/api/article/' + this.$route.params.id)
        .then(res => {
          this.article = res.data
//          this.article.categories = []
        }).catch(err => {
          console.log(err)
        })
    },
    autoCreateSlug (index) {
      if (this.autoSlug) {
        this.article.slug = slug(this.article.title, {lower: true})
      }
    },

    postUpdateArticle () {
      this.$http.put(this.baseUrl + '/api/article/' + this.article._id,
        this.article
      )
        .then(res => {
          openNotification({
            message: 'Cập nhập thành công',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          openNotification({
            message: 'Có lỗi',
            type: 'danger',
            duration: 5000
          })
        })
    }
  }
}
</script>
