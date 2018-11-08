import Api from '../services/Api'

export default {
    getAllRoles() {
        return Api().get('/roles')
    },
}