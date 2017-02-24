<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1>Data grid</h1>
          <handsontable :data="rawData" :settings="{ }"></handsontable>
          <input type="text" v-model="test" @input="testFunction()" >
          <ul id="example-1">
            <li v-for="(user, index) in users">
              <!--{{ user.name }}-->
              <input type="text" class="input" v-model="users[index].name" @input="testFunction(index)" >
            </li>
          </ul>
          <div @click="openModalBasic()">{{global.apiUrl}}</div>
        </article>
      </div>
    </div>
    <modal :visible="showModal" @close="closeModalBasic"></modal>
  </div>
</template>

<script>
import Handsontable from 'vue-handsontable'
import Modal from '../components/modals/Modal'

const api = 'https://jsonplaceholder.typicode.com/users'

export default {

  components: {
    Modal,
    Handsontable
  },

  mounted: function () {
    this.$http.get('https://jsonplaceholder.typicode.com/posts/1').then(response => {
      this.test = response.data.body
    }, response => {
      console.log(response)
    })
    this.loadData()
  },

  testFunction () {
    console.log('ok !')
  },

  data () {
    return {
      showModal: false,
      rawData: [
        ['', 'Kia', 'Nissan', 'Toyota', 'Honda'],
        ['2008', 10, 11, 12, 13],
        ['2009', 20, 11, 14, 13],
        ['2010', 30, 15, 12, 13]
      ],
      test: 'ok',
      users: [],
      global: this.$store.state.pkg
    }
  },

  methods: {
    openModalBasic () {
      this.showModal = true
    },
    closeModalBasic () {
      this.showModal = false
    },
    loadData () {
      console.log(this.test)
      console.log('run loadData !!!!')
      this.$http({
        url: api
      }).then((response) => {
        this.users = response.data
      }).catch((error) => {
        console.log(error)
      })
    },
    postData () {
      var url = this.global.apiUrl + '/test'
      this.$http.post(url, {})
        .then(res =>
          console.log(res)
        ).catch(err =>
          console.log(err)
        )
    }
  }

}
</script>
