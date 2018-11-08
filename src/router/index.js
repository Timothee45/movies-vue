import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import Movies from '../components/Movies'
import Ddurs from '../components/Ddurs'
import Import from '../components/Import'
import Genres from '../components/Genres'
import Personnes from '../components/Personnes'
import PersonneDetail from '../components/PersonneDetail'
import Roles from '../components/Roles'
import Nationalites from '../components/Nationalites'
import MovieDetail from '../components/MovieDetail'
import Types from '../components/Types'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },{
      path: '/movies',
      name: 'Movies',
      component: Movies
    },{
      path: '/movies/:id',
      name: 'MovieDetail',
      component: MovieDetail
    },{
      path: '/ddurs',
      name: 'Ddurs',
      component: Ddurs
    },{
      path: '/import',
      name: 'Import',
      component: Import
    },{
      path: '/genres',
      name: 'Genres',
      component: Genres
    },{
      path: '/personnes',
      name: 'Personnes',
      component: Personnes
    },{
      path: '/personnes/:id',
      name: 'PersonneDetail',
      component: PersonneDetail
    },{
      path: '/roles',
      name: 'Roles',
      component: Roles
    },{
      path: '/nationalites',
      name: 'Nationalites',
      component: Nationalites
    },{
      path: '/types',
      name: 'Types',
      component: Types
    }
  ]
})
