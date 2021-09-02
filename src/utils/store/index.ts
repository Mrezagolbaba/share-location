import { createStore } from "redux";
import rootReducer from "src/utils/reducers";

export default createStore(
    rootReducer,
    (window as any)?.__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any)?.__REDUX_DEVTOOLS_EXTENSION__()
);