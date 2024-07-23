import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveyComponent } from './delivey.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { DeliveryEffects } from './state/delivery.effects';
import { LogisticService } from '../../services/logistic.service';
import {
  deliveryPanelReducer,
  DeliveryPanelState,
  DeliveryPanelStatus,
} from './state/delivery.reducer';
import { MatTableModule } from '@angular/material/table';
import { provideMockActions } from '@ngrx/effects/testing';
import { By } from '@angular/platform-browser';
import { deliveryPanelActions } from './state/delivery.action';
import { DeliveryPanelResult } from './state/models/delivery-panel-result.model';
import { cold, hot } from 'jest-marbles';

describe('DeliveyComponent', () => {
  let component: DeliveyComponent;
  let fixture: ComponentFixture<DeliveyComponent>;
  let store: MockStore;
  let actions$: Observable<any>;
  let effects: DeliveryEffects;
  let logisticService: jest.Mocked<LogisticService>;

  const initialState: DeliveryPanelState = {
    deliveryPanelResult: {
      deliveryPanel: [],
      totalPages: 0,
    },
    error: null,
    page: 0,
    status: DeliveryPanelStatus.pending,
  };

  beforeEach(async () => {
    const logisticServiceMock = {
      getLogisticDataDelivery: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatTableModule, DeliveyComponent],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        { provide: LogisticService, useValue: logisticServiceMock },
        DeliveryEffects,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DeliveyComponent);
    component = fixture.componentInstance;
    effects = TestBed.inject(DeliveryEffects);
    logisticService = TestBed.inject(
      LogisticService
    ) as jest.Mocked<LogisticService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the "Visão Geral de Entregas" table', () => {
    store.overrideSelector('deliveryPanelDataSource$', {
      deliveryPanelResult: {
        deliveryPanel: [
          {
            driver: 'driver 1',
            neighborhood: 'neighborhood 1',
            status: 'ENTREGUE',
          },
        ],
        totalPages: 1,
      },
      page: 1,
      status: DeliveryPanelStatus.success,
    } as DeliveryPanelState);

    fixture.detectChanges();

    const tableHeader = fixture.debugElement.query(By.css('h6'));
    expect(tableHeader.nativeElement.textContent).toContain(
      'Visão Geral de Entregas'
    );
  });

  describe('Delivery Actions', () => {
    it('should create loadDeliveryPanel action', () => {
      const action = deliveryPanelActions.loadDeliveryPanel({
        page: 1,
        filter: '',
        filterType: '',
      });
      expect(action.type).toBe('[delivery] Load Delivery Panel');
    });

    it('should create loadedDeliveryPanel action', () => {
      const payload = {
        deliveryPanel: [
          {
            driver: 'driver 1',
            neighborhood: 'neighborhood 1',
            status: 'ENTREGUE',
          },
        ],
        totalPages: 1,
      };
      const action = deliveryPanelActions.loadedDeliveryPanel({
        deliveryPanelResult: payload,
      });
      expect(action.type).toBe('[delivery] Loaded Delivery Panel');
      expect(action.deliveryPanelResult).toEqual(payload);
    });
  });

  describe('Delivery Reducer', () => {
    it('should handle loadDeliveryPanel action', () => {
      const action = deliveryPanelActions.loadDeliveryPanel({
        page: 1,
        filter: '',
        filterType: '',
      });
      const state = deliveryPanelReducer(initialState, action);
      expect(state.status).toBe(DeliveryPanelStatus.loading);
    });

    it('should handle loadedDeliveryPanel action', () => {
      const payload = {
        deliveryPanel: [
          {
            driver: 'driver 1',
            neighborhood: 'neighborhood 1',
            status: 'ENTREGUE',
          },
        ],
        totalPages: 1,
      };
      const action = deliveryPanelActions.loadedDeliveryPanel({
        deliveryPanelResult: payload,
      });
      const state = deliveryPanelReducer(initialState, action);
      expect(state.deliveryPanelResult).toEqual(payload);
      expect(state.status).toBe(DeliveryPanelStatus.success);
    });
  });

  describe('Delivery Effects', () => {
    it('should load delivery panel data', () => {
      const payload: DeliveryPanelResult = {
        deliveryPanel: [
          {
            driver: 'driver 1',
            neighborhood: 'neighborhood 1',
            status: 'ENTREGUE',
          },
        ],
        totalPages: 1,
      };
      const action = deliveryPanelActions.loadDeliveryPanel({
        page: 1,
        filter: '',
        filterType: '',
      });
      const outcome = deliveryPanelActions.loadedDeliveryPanel({
        deliveryPanelResult: payload,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: payload });
      logisticService.getLogisticDataDelivery.mockReturnValue(response);

      const expected = cold('--b', { b: outcome });

      expect(effects.getDeliveryPanelEffect$).toBeObservable(expected);
    });

    it('should handle errors when loading delivery panel data', () => {
      const action = deliveryPanelActions.loadDeliveryPanel({
        page: 1,
        filter: '',
        filterType: '',
      });
      const error = new Error('Error loading data');
      const outcome = deliveryPanelActions.errorDeliveryPanel({
        error: 'Houve um erro',
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      logisticService.getLogisticDataDelivery.mockReturnValue(response);

      const expected = cold('--b', { b: outcome });

      expect(effects.getDeliveryPanelEffect$).toBeObservable(expected);
    });
  });
});
