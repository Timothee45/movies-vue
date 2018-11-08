import Api from '../services/Api'

export default {
    getAllNationalites() {
        return Api().get('/nationalites')
    },
    postNationalite(nationalite) {
        return Api().post('/nationalites', {body: nationalite})
    }
}