import { createReducer, on } from "@ngrx/store";
import { deliveryPanelActions } from "./delivery.action";
import { DeliveryPanelResult } from "./models/delivery-panel-result.model";

export enum DeliveryPanelStatus {
    loading = 'loading',
    pending = 'pending',
    error = 'error',
    success = 'success',
}

export interface DeliveryPanelState {
    deliveryPanelResult: DeliveryPanelResult,
    error: string | null,
    page: number,
    status: DeliveryPanelStatus
}

const initialState: DeliveryPanelState = {
    deliveryPanelResult: {
        deliveryPanel: [],
        totalPages: 0, 
    },
    error: null,
    page: 0,
    status: DeliveryPanelStatus.pending
}

export const deliveryPanelReducer = createReducer(
    initialState,
    on(deliveryPanelActions.loadDeliveryPanel, (state) => {
        return {
            ...state,
            status: DeliveryPanelStatus.loading,
        }
    }),
    on(deliveryPanelActions.loadedDeliveryPanel, (state, deliveryPanelObj) => {
        return {
            ...state,
            deliveryPanelResult: deliveryPanelObj.deliveryPanelResult,
            status: DeliveryPanelStatus.success,
        }
    }),
    on(deliveryPanelActions.errorDeliveryPanel, (state, errorObj) => {
        return {
            ...state,
            error: errorObj.error,
            status: DeliveryPanelStatus.error,
        }
    }),
);