import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LogisticService } from '../../../services/logistic.service';
import { deliveryPanelActions } from './delivery.action';

export class DeliveryEffects {
  actions$ = inject(Actions);
  logisticService = inject(LogisticService);

  getDeliveryPanelEffect$ = createEffect(() => 
    this.actions$.pipe(
      ofType(deliveryPanelActions.loadDeliveryPanel),
      switchMap((action) =>
        this.logisticService.getLogisticDataDelivery(action.page, action.filter, action.filterType).pipe(
          map((deliveryPanelResult) => deliveryPanelActions.loadedDeliveryPanel({deliveryPanelResult: deliveryPanelResult})),
          catchError((error) =>
            of(deliveryPanelActions.errorDeliveryPanel({ error: 'Houve um erro' }))
          )
        )
      )
    )
  );
}

