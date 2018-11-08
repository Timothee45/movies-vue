import Api from '../services/Api'

export default {
    getAllDdurs() {
        return Api().get('/ddurs')
    },
    insertDdur(ddur) {
        return Api().post('/ddurs', {body: ddur})
    },
    updateDdur(ddur) {
        return Api().put('/ddurs', {body: ddur})
    },
}