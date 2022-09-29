import * as actionType from "./actionTypes";
import {type} from "@testing-library/user-event/dist/type";
import axios from "axios";

export function getAllVehiclesSuccess(data){
    console.log("payload", data)
    return {type:actionType.GET_ALL_VEHICLE, payload:data}
}

export const getAllVehicle = () => {

    return async function(dispatch){
        await axios.get("/vehicles", {}, {
            auth: {
                username: "derdemkara@gmail.com",
                password: "12345"
            }
        }).then(result=> dispatch(getAllVehiclesSuccess(result.data))).catch(err => console.log(err));
    }


}