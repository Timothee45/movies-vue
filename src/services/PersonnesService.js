import Api from '../services/Api'

export default {
    getAllPersonnes() {
        return Api().get('/personnes')
    },
    getPersonneById(id) {
        return Api().get('/personnes/' + id)
    },
    getAllMoviesOfOnePerson(id) {
        return Api().get('/personnes/' + id + '/movies')
    },
    updatePersonne(personne) {
        return Api().put('/personnes', {body: personne})
    },
    createPersonne(personne) {
        return Api().post('/personnes', {body: personne})
    },
    addMoviesToAPersonne(id, movies) {
        console.log(movies);
        return Api().post('/personnes/' + id + '/movies', {body: movies})
    },
}