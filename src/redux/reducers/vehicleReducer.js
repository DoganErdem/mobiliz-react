import * as actionType from "../actions/actionTypes";

const vehicleReducer = (state = null, action) => {
    console.log("action", action)
    switch (action.type){
        case actionType.GET_ALL_VEHICLE:
            return action.payload;
        default:
            return state;
    }
}

export default vehicleReducer;