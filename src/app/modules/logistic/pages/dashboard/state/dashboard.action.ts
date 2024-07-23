import { createAction, props } from "@ngrx/store";
import { Panel } from "./models/panel.model";
import { PanelNeighborhood } from "./models/panel-by-neighborhood.model";

const loadTotalByDriverPanel = createAction('[dashboard] Load Total By Driver Panel');
const loadFailurePanel = createAction('[dashboard] Load Failure Panel');
const loadProgressPanel = createAction('[dashboard] Load Progress Panel');

const loadedTotalByDriverPanel = createAction('[dashboard] Loaded Total By Driver Panel', props<{totalByDriverPanel: Panel[]}>());
const loadedFailurePanel = createAction('[dashboard] Loaded Failure Panel', props<{failurePanel: Panel[]}>());
const loadedProgressPanel = createAction('[dashboard] Loaded Progress Panel', props<{progressPanel: PanelNeighborhood[]}>());

const errorTotalByDriverPanel = createAction('[dashboard] Error Total By Driver Panel', props<{error: string}>());
const errorFailurePanel = createAction('[dashboard] Error Failure Panel', props<{error: string}>());
const errorProgressPanel = createAction('[dashboard] Error Progress Panel', props<{error: string}>());

export const dashboardActions = {
    loadTotalByDriverPanel,
    loadedTotalByDriverPanel,
    errorTotalByDriverPanel,

    loadFailurePanel,
    loadedFailurePanel,
    errorFailurePanel,

    loadProgressPanel,
    loadedProgressPanel,
    errorProgressPanel,
};

