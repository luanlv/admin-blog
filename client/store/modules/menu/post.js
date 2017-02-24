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
    }
  ]
}
