import Api from '../services/Api'

export default {
    getStatsMoviesSeen() {
        return Api().get('/stats/vues')
    },
    getMostUsedActors() {
        return Api().get('/stats/actors/mostused')
    },
    getMostUsedGenres() {
        return Api().get('/stats/genres')
    },
    getMostUsedTypes() {
        return Api().get('/stats/types')
    },
    searchByMovies(words) {
        return Api().post('/search/movies', {body: words})
    },
    searchByPersonnes(words) {
        return Api().post('/search/personnes', {body: words})
    },
}