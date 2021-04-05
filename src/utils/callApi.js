
import { message } from 'antd'
import { API_HOST } from '../constants/config'
import axios from 'axios'

//get image
export const getImageURL = (imageFile) => {
    return `${API_HOST}/images/${imageFile}`
}
//call-api
export async function callApi(endpoint, method = 'GET', body, config) {
    try {
        let dataQuery = { data: body }
        if (method === 'GET') {
            dataQuery = { params: body }
        }
        
        const response = await axios({
            method: method,
            url: `${endpoint}`,
            baseURL: API_HOST,
            ...dataQuery,
            ...config
        })
        return response.data
    } catch (err) {
        console.log('err api', err);
        message.error('Hệ thống đang xảy ra lỗi. Bạn vui lòng thử lại sau!');
    }
}