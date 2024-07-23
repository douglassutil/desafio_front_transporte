import { IAppState } from "../../../state/app.state";


export const dashboardSelector = (appState: IAppState) => appState.dashboardState;

export const dashboardTotalByDriverPanelSelector = (appState: IAppState) => appState.dashboardState.totalByDriverPanel;
export const dashboardFailurePanelSelector = (appState: IAppState) => appState.dashboardState.failurePanel;
export const dashboardProgressPanelSelector = (appState: IAppState) => appState.dashboardState.progressPanel;