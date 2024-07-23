import { ActionReducerMap } from "@ngrx/store";
import { IAppState } from "./app.state";
import { dashboardReducer } from "../pages/dashboard/state/dashboard.reducer";
import { deliveryPanelReducer } from "../pages/delivey/state/delivery.reducer";

export const appReducers: ActionReducerMap<IAppState> = {
    dashboardState: dashboardReducer,
    deliveryPanelState: deliveryPanelReducer,
}