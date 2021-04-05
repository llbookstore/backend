import {
    GET_PUBLISHING_HOUSES
}
    from '../constants/actionTypes'

const initialState = [];

const publishingHouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PUBLISHING_HOUSES: 
            return [...action.publishing_house]
        default:
            return state;
    }
}

export default publishingHouseReducer;