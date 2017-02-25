import lazyLoading from './lazyLoading'

export default {
  meta: {
    label: 'Post',
    icon: 'fa-bar-chart-o',
    expanded: true
  },
  children: [
    {
      name: 'Category',
      path: '/post/category',
      component: lazyLoading('post/Category')
    },
    {
      name: 'Article',
      path: '/post/article',
      component: lazyLoading('post/Article')
    },
    {
      path: '/post/article/:id',
      component: lazyLoading('post/EditArticle')
    }
  ]
}
