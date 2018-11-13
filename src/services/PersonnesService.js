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
    getPersonneMissingInfos(nbrPersonnes) {
        return Api().get('/personnes/missinginfos/' + nbrPersonnes)
    },
    updatePersonne(personne) {
        return Api().put('/personnes', {body: personne})
    },
    createPersonne(personne) {
        return Api().post('/personnes', {body: personne})
    },
    addMoviesToAPersonne(id, movies) {
        return Api().post('/personnes/' + id + '/movies', {body: movies})
    },
    postPersonnesPhotoAndDate(personnes) {
        return Api().post('/personnes/missinginfos', {body: personnes})
    },
}