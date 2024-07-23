import { Panel } from "./panel.model";

export interface Dashboard {
    totalByDriverPanel: Panel,
    failurePanel: Panel,
    progressPanel: Panel,
}