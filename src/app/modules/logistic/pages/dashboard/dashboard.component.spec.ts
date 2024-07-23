import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardComponent } from './dashboard.component';
import { MatTableModule } from '@angular/material/table';
import {
  PanelState,
  PanelNeighborhoodState,
  PanelStatus,
  dashboardReducer,
} from './state/dashboard.reducer';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { dashboardActions } from './state/dashboard.action';
import { LogisticService } from '../../services/logistic.service';
import { Panel } from './state/models/panel.model';
import { cold, hot } from 'jest-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { DashboardEffects } from './state/dashboard.effects';
import { PanelNeighborhood } from './state/models/panel-by-neighborhood.model';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;
  let actions$: Observable<any>;
  let effects: DashboardEffects;
  let logisticService: jest.Mocked<LogisticService>;

  const initialState = {
    totalByDriverPanel: { dashboard: [], error: null, status: PanelStatus.pending, } as PanelState,
    failurePanel: { dashboard: [], error: null, status: PanelStatus.pending, } as PanelState,
    progressPanel: { dashboard: [], error: null, status: PanelStatus.pending, } as PanelNeighborhoodState,
  };

  beforeEach(async () => {
    const logisticServiceMock = {
        getLogisticDataTotalByDriver: jest.fn(),
        getLogisticDataFailureByDriver: jest.fn(),
        getLogisticDataTotalByNeighborhood: jest.fn(),
    };

    await TestBed.configureTestingModule({
        imports: [MatTableModule, DashboardComponent],
        providers: [
            provideMockStore({ initialState }),
            provideMockActions(() => actions$),
            { provide: LogisticService, useValue: logisticServiceMock },
            DashboardEffects,
        ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    effects = TestBed.inject(DashboardEffects);
    logisticService = TestBed.inject(LogisticService) as jest.Mocked<LogisticService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the "Visão Geral de Entregas" table', () => {
    store.overrideSelector('totalDataSource$', {
      dashboard: [{ driver: 'John', totalAmount: 10, successAmount: 8 }],
      status: PanelStatus.success,
    } as PanelState);
    fixture.detectChanges();

    const tableHeader = fixture.debugElement.query(By.css('h6'));
    expect(tableHeader.nativeElement.textContent).toContain(
      'Visão Geral de Entregas'
    );
  });

  it('should display the "Entregas com Falha" table', () => {
    store.overrideSelector('failureDataSource$', {
      dashboard: [{ driver: 'John', failureAmount: 2 }],
      status: PanelStatus.success,
    } as PanelState);
    fixture.detectChanges();

    const tableHeader = fixture.debugElement.queryAll(By.css('h6'))[1];
    expect(tableHeader.nativeElement.textContent).toContain(
      'Entregas com Falha'
    );
  });

  it('should display the "Entregas por bairro" table', () => {
    store.overrideSelector('progressDataSource$', {
      dashboard: [
        { neighborhood: 'Center', totalAmount: 20, successAmount: 18 },
      ],
      status: PanelStatus.success,
    } as PanelNeighborhoodState);
    fixture.detectChanges();

    const tableHeader = fixture.debugElement.queryAll(By.css('h6'))[2];
    expect(tableHeader.nativeElement.textContent).toContain(
      'Entregas por bairro'
    );
  });

  describe('Dashboard Actions', () => {
    it('should create loadTotalByDriverPanel action', () => {
      const action = dashboardActions.loadTotalByDriverPanel();
      expect(action.type).toBe('[dashboard] Load Total By Driver Panel');
    });

    it('should create loadedTotalByDriverPanel action', () => {
      const payload = [
        { driver: 'John', totalAmount: 10, successAmount: 8, failureAmount: 2 },
      ];
      const action = dashboardActions.loadedTotalByDriverPanel({
        totalByDriverPanel: payload,
      });
      expect(action.type).toBe('[dashboard] Loaded Total By Driver Panel');
      expect(action.totalByDriverPanel).toEqual(payload);
    });
  });

  describe('Dashboard Reducer', () => {
    it('should handle loadTotalByDriverPanel action', () => {
      const action = dashboardActions.loadTotalByDriverPanel();
      const state = dashboardReducer(initialState, action);
      expect(state.totalByDriverPanel.status).toBe(PanelStatus.loading);
    });
    
    it('should handle loadFailurePanel action', () => {
      const action = dashboardActions.loadFailurePanel();
      const state = dashboardReducer(initialState, action);
      expect(state.failurePanel.status).toBe(PanelStatus.loading);
    });
    
    it('should handle loadProgressPanel action', () => {
      const action = dashboardActions.loadProgressPanel();
      const state = dashboardReducer(initialState, action);
      expect(state.progressPanel.status).toBe(PanelStatus.loading);
    });

    it('should handle loadedTotalByDriverPanel action', () => {
      const payload = [
        { driver: 'John', totalAmount: 10, successAmount: 8, failureAmount: 2 },
      ];
      const action = dashboardActions.loadedTotalByDriverPanel({
        totalByDriverPanel: payload,
      });
      const state = dashboardReducer(initialState, action);
      expect(state.totalByDriverPanel.dashboard).toEqual(payload);
      expect(state.totalByDriverPanel.status).toBe(PanelStatus.success);
    });
   
    it('should handle loadedFailurePanel action', () => {
      const payload = [
        { driver: 'John', totalAmount: 10, successAmount: 8, failureAmount: 2 },
      ];
      const action = dashboardActions.loadedFailurePanel({
        failurePanel: payload,
      });
      const state = dashboardReducer(initialState, action);
      expect(state.failurePanel.dashboard).toEqual(payload);
      expect(state.failurePanel.status).toBe(PanelStatus.success);
    });
   
    it('should handle loadedProgressPanel action', () => {
      const payload = [
        { drivers: ['John'], totalAmount: 10, successAmount: 8, failureAmount: 2, neighborhood: 'neighborhood 1' },
      ];
      const action = dashboardActions.loadedProgressPanel({
        progressPanel: payload,
      });
      const state = dashboardReducer(initialState, action);
      expect(state.progressPanel.dashboard).toEqual(payload);
      expect(state.progressPanel.status).toBe(PanelStatus.success);
    });
  });

  describe('Dashboard Effects', () => {
      
    it('should load total by driver panel data', () => {
      const payload: Panel[] = [{ driver: 'John', totalAmount: 10, successAmount: 8, failureAmount: 2 }];
      const action = dashboardActions.loadTotalByDriverPanel();
      const outcome = dashboardActions.loadedTotalByDriverPanel({ totalByDriverPanel: payload });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: payload });
      logisticService.getLogisticDataTotalByDriver.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getTotalByDriverPanelEffect$).toBeObservable(expected);
    });
    
    it('should load failure panel data', () => {
      const payload: Panel[] = [{ driver: 'John', totalAmount: 10, successAmount: 8, failureAmount: 2 }];
      const action = dashboardActions.loadFailurePanel();
      const outcome = dashboardActions.loadedFailurePanel({ failurePanel: payload });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: payload });
      logisticService.getLogisticDataFailureByDriver.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getFailureByDriverPanelEffect$).toBeObservable(expected);
    });
    
    it('should load Progress panel data', () => {
      const payload: PanelNeighborhood[] = [{ drivers: ["John"], neighborhood: 'Center', totalAmount: 20, successAmount: 18, failureAmount: 2 }];
      const action = dashboardActions.loadProgressPanel();
      const outcome = dashboardActions.loadedProgressPanel({ progressPanel: payload });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: payload });
      logisticService.getLogisticDataTotalByNeighborhood.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getTotalByneighborhoodPanelEffect$).toBeObservable(expected);
    });
  
    it('should handle errors when loading total by driver panel data', () => {
      const action = dashboardActions.loadTotalByDriverPanel();
      const error = new Error('Error loading data');
      const outcome = dashboardActions.errorTotalByDriverPanel({ error: 'Houve um erro' });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      logisticService.getLogisticDataTotalByDriver.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getTotalByDriverPanelEffect$).toBeObservable(expected);
    });
    
    it('should handle errors when loading failure panel data', () => {
      const action = dashboardActions.loadFailurePanel();
      const error = new Error('Error loading data');
      const outcome = dashboardActions.errorFailurePanel({ error: 'Houve um erro' });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      logisticService.getLogisticDataFailureByDriver.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getFailureByDriverPanelEffect$).toBeObservable(expected);
    });
    
    it('should handle errors when loading Progress panel data', () => {
      const action = dashboardActions.loadProgressPanel();
      const error = new Error('Error loading data');
      const outcome = dashboardActions.errorProgressPanel({ error: 'Houve um erro' });
  
      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      logisticService.getLogisticDataTotalByNeighborhood.mockReturnValue(response);
  
      const expected = cold('--b', { b: outcome });
  
      expect(effects.getTotalByneighborhoodPanelEffect$).toBeObservable(expected);
    });
  
  });
});


