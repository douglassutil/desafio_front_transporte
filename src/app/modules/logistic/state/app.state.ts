import { DashboardState } from "../pages/dashboard/state/dashboard.reducer";
import { DeliveryPanelState } from "../pages/delivey/state/delivery.reducer";

export interface IAppState {
    dashboardState: DashboardState;
    deliveryPanelState: DeliveryPanelState;
}