import {
    GET_SALES
}
    from '../constants/actionTypes'

const initialState = [];

const saleReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SALES: 
            return [...action.sales]
        default:
            return state;
    }
}

export default saleReducer;