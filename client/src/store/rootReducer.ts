import { combineReducers } from "redux";
import dashboardReducer from "./dashboardSlice";

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
