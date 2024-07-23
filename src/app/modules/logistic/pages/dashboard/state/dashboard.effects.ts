import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LogisticService } from '../../../services/logistic.service';
import { dashboardActions } from './dashboard.action';


export class DashboardEffects {
  actions$ = inject(Actions);
  logisticService = inject(LogisticService);

  getTotalByDriverPanelEffect$ = createEffect(() => 
    this.actions$.pipe(
      ofType(dashboardActions.loadTotalByDriverPanel),
      switchMap(() =>
        this.logisticService.getLogisticDataTotalByDriver().pipe(
          map((totalByDriverPanel) => dashboardActions.loadedTotalByDriverPanel({totalByDriverPanel: totalByDriverPanel})),
          catchError((error) =>
            of(dashboardActions.errorTotalByDriverPanel({ error: 'Houve um erro' }))
          )
        )
      )
    )
  );
  
  getFailureByDriverPanelEffect$ = createEffect(() => 
    this.actions$.pipe(
      ofType(dashboardActions.loadFailurePanel),
      switchMap(() =>
        this.logisticService.getLogisticDataFailureByDriver().pipe(
          map((failurePanel) => dashboardActions.loadedFailurePanel({failurePanel: failurePanel})),
          catchError((error) =>
            of(dashboardActions.errorFailurePanel({ error: 'Houve um erro' }))
          )
        )
      )
    )
  );
  
  getTotalByneighborhoodPanelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardActions.loadProgressPanel),
      switchMap(() =>
        this.logisticService.getLogisticDataTotalByNeighborhood().pipe(
          map((progressPanel) => dashboardActions.loadedProgressPanel({progressPanel: progressPanel})),
          catchError((error) =>
            of(dashboardActions.errorProgressPanel({ error: 'Houve um erro' }))
          )
        )
      )
    )
  )
}

