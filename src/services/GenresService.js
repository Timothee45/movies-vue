import Api from '../services/Api'

export default {
    getAllGenres() {
        return Api().get('/genres')
    },
    postGenre(genre) {
    	return Api().post('/genres', {body: genre})
    },
    updateGenre(genre) {
    	console.log(genre);
    	return Api().put('/genres', {body: genre})
    },
}