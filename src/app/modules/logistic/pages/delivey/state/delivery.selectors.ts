import { IAppState } from "../../../state/app.state";


export const deliveryPanelSelector = (appState: IAppState) => appState.deliveryPanelState;