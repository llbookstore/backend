import {
    GET_USER_INFO,
    LOG_OUT,
    GET_AUTHORS,
    GET_PUBLISHING_HOUSES,
    GET_SALES,
    GET_CATEGORIES
} from '../constants/actionTypes'

export const getUserInfo = (user) => {
    return {
        type: GET_USER_INFO,
        user
    }
}
export const logOut = () => {
    return {
        type: LOG_OUT
    }
}
export const getAuthor = (author) => {
    return {
        type: GET_AUTHORS,
        author
    }
}
export const getSales = (sales) => {
    return {
        type: GET_SALES,
        sales
    }
}
export const getPublishingHouse = (publishing_house) => {
    return {
        type: GET_PUBLISHING_HOUSES,
        publishing_house
    }
}
export const getCategories = (category) => {
    return {
        type: GET_CATEGORIES,
        category
    }
}
