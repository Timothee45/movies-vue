import Api from '../services/Api'

export default {
    getAllMovies() {
        return Api().get('/movies')
    },
    getMovieById(id) {
        return Api().get('/movies/' + id)
    },
    getAllMoviesTitles() {
        return Api().get('/movies/titles')
    },
    getAllMovieGenres(idMovie) {
        return Api().get('/movies/' + idMovie + '/genres')
    },
    getAllPersonnesInMovies() {
        return Api().get('/movies/personnes')
    },
    postMovies(movies) {
    	return Api().post('/movies', {body: movies})
    },
    postMovieGenres(idMovie, genres) {
        return Api().post('/movies/' + idMovie + '/genres', {body: genres})
    },
    postMovieMissingGenres(movies) {
        return Api().post('/movies/genres', {body: movies})
    },
    updateMovie(movie) {
    	console.log(movie);
    	return Api().put('/movies', {body: movie})
    },
    getLastCreatedMovies(nbrMovies) {
        return Api().get('/movies/lastcreated/' + nbrMovies)
    },
    getEmptyMovies(nbrMovies) {
        return Api().get('/movies/missingjaquette/' + nbrMovies)
    },
    getMissingGenresMovies(nbrMovies) {
        return Api().get('/movies/missinggenres/' + nbrMovies)
    },
    postMovieJaquetteAndDateSortie(movies) {
        return Api().put('/movies/missingjaquette', {body: movies})
    },
}