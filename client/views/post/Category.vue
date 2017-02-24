<template>
  <div class="tile is-ancestor">

    <div class="tile is-vertical is-6 ">
      <div class="tile is-parent">
        <article class="tile is-child box ">
          <p class="title">{{ (editIndex >= 0)?("Editing category with id=" + editIndex):"New Category" }}</p>
          <div class="content">
            <div class="block">
              <label class="label">Title</label>
              <p class="control">
                <input v-if="editIndex<0" class="input" type="text" placeholder="Title" v-model="newForm.title" @input="autoCreateSlug()">
                <input v-else class="input" type="text" placeholder="Title" v-model="categories[editIndex].title" @input="autoCreateSlug(index)">
              </p>
              <label class="label">Slug</label>
              <p class="control">
                <input  v-if="editIndex<0"  type="text" class="input" v-model="newForm.slug">
                <input v-else type="text" class="input" v-model="categories[editIndex].slug">
              </p>
              <label class="checkbox">
                <input type="checkbox" v-model="autoSlug">
                Auto create slug
              </label>
              <p class="control">
                <button v-if="editIndex<0" class="button is-primary" @click="postNewCategory()">Submit</button>
                <button v-else class="button is-primary" @click="postUpdateCategory(editIndex)">Update</button>

                <button v-if="editIndex<0"  class="button is-link" @click="resetForm">Reset</button>
                <button v-else class="button is-link" @click="editIndex=-1">Back to create new category</button>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-parent">
      <article class="tile is-child box">
        <div class="content">
          <p class="title">Categories</p>
          <div class="content">
            <div class="table-responsive">
              <table class="table is-bordered is-striped is-narrow">
                <thead>
                <tr>
                  <th>Category name</th>
                  <th colspan="3">Actions</th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                  <th>Category name</th>
                  <th colspan="2">Actions</th>
                </tr>
                </tfoot>
                <tbody>
                <tr v-for="(category, index) in categories">
                  <td>
                    <a href="#">{{ category.title}}</a>
                  </td>
                  <td class="is-icon pointer" @click="selectCategory(index)">
                    {{ (index === editIndex)?"Editing":"Edit" }}
                  </td>
                  <td class="is-icon pointer" @click="deleteCategory(index)">
                    Delete
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </article>
    </div>


  </div>
</template>

<style>
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    background: #ddd;
  }
</style>

<script>
import slug from 'slug'
import Vue from 'vue'
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
  data () {
    return {
      message: 'ok',
      newForm: {
        title: '',
        slug: ''
      },
      autoSlug: true,
      categories: [],
      editIndex: -1,
      baseUrl: this.$store.state.pkg.apiUrl
    }
  },
  created: function () {
    this.getCategories()
  },
  methods: {
    postUpdateCategory (index) {
      this.$http.put(this.baseUrl + '/api/category/' + this.categories[index]._id,
        this.categories[index]
      )
        .then(res => {
          openNotification({
            message: 'Cập nhập danh mục thành công',
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
    },
    postNewCategory () {
      this.$http.post(this.baseUrl + '/api/category/new',
        this.newForm
      )
        .then(res => {
          openNotification({
            message: 'Thêm thành danh mục thành công',
            type: 'success',
            duration: 2000
          })
          this.newForm = {
            title: '',
            slug: ''
          }
          this.categories.unshift(res.data)
        }).catch(() => {
          openNotification({
            message: 'Có lỗi',
            type: 'danger',
            duration: 5000
          })
        })
    },
    autoCreateSlug (index) {
      if (this.autoSlug) {
        if (index) {
          this.categories[index].slug = slug(this.categories[index].title, {lower: true})
        } else {
          this.newForm.slug = slug(this.newForm.title, {lower: true})
        }
      }
    },
    getCategories () {
      this.$http.get(this.baseUrl + '/api/category/get')
        .then(res => {
          this.categories = res.data
        }).catch(err => {
          console.log(err)
        })
    },
    deleteCategory (index) {
      this.$http.delete(this.baseUrl + '/api/category/delete/' + this.categories[index]._id)
        .then(res => {
          this.categories = this.categories.filter((el) => {
            return el._id !== this.categories[index]._id
          })
          openNotification({
            message: 'Xóa danh mục thành công',
            type: 'success',
            duration: 2000
          })
          console.log(res)
        }).catch(() => {
          openNotification({
            message: 'Có lỗi',
            type: 'danger',
            duration: 5000
          })
        })
    },
    selectCategory (index) {
      this.editIndex = index
    },
    resetForm () {
      this.newForm = {
        title: '',
        slug: ''
      }
    }
  }
}
</script>
