<template>
  <div class="content has-text-centered">

    <h1 class="is-title is-bold">{{ name.replace('-', ' ') }}</h1>

    <p>
      <strong>{{ description }}</strong>,
      <a :href="homepage">Live Demo</a>
    </p>

    <p>Supports Vue 2.0 and Bulma 0.2!</p>
  </div>
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
