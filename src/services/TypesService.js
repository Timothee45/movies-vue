import Api from '../services/Api'

export default {
    getAllTypes() {
        return Api().get('/types')
    },
}