import {applyMiddleware, compose, createStore} from "redux";

import reducers from "./index";
import thunk from "redux-thunk";

export default function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(reducers,composeEnhancers(applyMiddleware(thunk)));
}