import {
    GET_CATEGORIES
}
    from '../constants/actionTypes'

const initialState = [];

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CATEGORIES: 
            return [...action.category]
        default:
            return state;
    }
}

export default categoryReducer;