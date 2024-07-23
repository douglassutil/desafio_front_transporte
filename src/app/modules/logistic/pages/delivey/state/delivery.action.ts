import { createAction, props } from "@ngrx/store";
import { DeliveryPanelResult } from "./models/delivery-panel-result.model";

const loadDeliveryPanel = createAction('[delivery] Load Delivery Panel', props<{page: number, filter: string, filterType: string}>());
const loadedDeliveryPanel = createAction('[delivery] Loaded Delivery Panel', props<{deliveryPanelResult: DeliveryPanelResult}>());
const errorDeliveryPanel = createAction('[delivery] Error Delivery Panel', props<{error: string}>());

export const deliveryPanelActions = {
    loadDeliveryPanel,
    loadedDeliveryPanel,
    errorDeliveryPanel,
};

