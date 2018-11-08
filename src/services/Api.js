import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `http://localhost:8080`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Bearer': 'ePK1c152AA387aa8866-632FGKYU100rererer6zsX90-RTE652bg7C8ZAxSD-6452nJ8725erFGDT-YUFSREedfffiyodKLNBXWPMPMPMES-67-fnUDfgrts-IOSuiIOFght'
        }
    })
}