import { createReducer, on } from "@ngrx/store";
import { Panel } from "./models/panel.model";
import { dashboardActions } from "./dashboard.action";
import { PanelNeighborhood } from "./models/panel-by-neighborhood.model";

export enum PanelStatus {
    loading = 'loading',
    pending = 'pending',
    error = 'error',
    success = 'success',
}

export interface PanelState {
    dashboard: Panel[],
    error: string | null,
    status: PanelStatus
}

export interface PanelNeighborhoodState {
    dashboard: PanelNeighborhood[],
    error: string | null,
    status: PanelStatus
}

export interface DashboardState {
    totalByDriverPanel: PanelState,
    failurePanel: PanelState,
    progressPanel: PanelNeighborhoodState,
}

const initialState: DashboardState = {
    totalByDriverPanel: {
        dashboard: [],
        error: null,
        status: PanelStatus.pending
    },
    failurePanel: {
        dashboard: [],
        error: null,
        status: PanelStatus.pending
    },
    progressPanel: {
        dashboard: [],
        error: null,
        status: PanelStatus.pending
    },
}

export const dashboardReducer = createReducer(
    initialState,
    on(dashboardActions.loadTotalByDriverPanel, (state) => {
        return {
            ...state,
            totalByDriverPanel: {
                ...state.totalByDriverPanel,
                status: PanelStatus.loading,
            }
        }
    }),
    on(dashboardActions.loadFailurePanel, (state) => {
        return {
            ...state,
            failurePanel: {
                ...state.failurePanel,
                status: PanelStatus.loading,
            }
        }
    }),
    on(dashboardActions.loadProgressPanel, (state) => {
        return {
            ...state,
            progressPanel: {
                ...state.progressPanel,
                status: PanelStatus.loading,
            }
        }
    }),
    on(dashboardActions.loadedTotalByDriverPanel, (state, totalByDriverPanelObj) => {
        return {
            ...state,
            totalByDriverPanel: {
                ...state.totalByDriverPanel,
                dashboard: totalByDriverPanelObj.totalByDriverPanel,
                status: PanelStatus.success,
            }
        }
    }),
    on(dashboardActions.loadedFailurePanel, (state, failurePanelObj) => {
        return {
            ...state,
            failurePanel: {
                ...state.failurePanel,
                dashboard: failurePanelObj.failurePanel,
                status: PanelStatus.success,
            }
        }
    }),
    on(dashboardActions.loadedProgressPanel, (state, progressPanelObj) => {
        return {
            ...state,
            progressPanel: {
                ...state.progressPanel,
                dashboard: progressPanelObj.progressPanel,
                status: PanelStatus.success,
            }
        }
    }),
    on(dashboardActions.errorTotalByDriverPanel, (state, errorObj) => {
        return {
            ...state,
            totalByDriverPanel: {
                ...state.totalByDriverPanel,
                error: errorObj.error,
                status: PanelStatus.error,
            }
        }
    }),
    on(dashboardActions.errorFailurePanel, (state, errorObj) => {
        return {
            ...state,
            failurePanel: {
                ...state.failurePanel,
                error: errorObj.error,
                status: PanelStatus.error,
            }
        }
    }),
    on(dashboardActions.errorProgressPanel, (state, errorObj) => {
        return {
            ...state,
            progressPanel: {
                ...state.progressPanel,
                error: errorObj.error,
                status: PanelStatus.error,
            }
        }
    }),
);