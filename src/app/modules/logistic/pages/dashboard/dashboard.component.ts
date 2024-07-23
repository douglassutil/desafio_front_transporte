import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  dashboardFailurePanelSelector,
  dashboardProgressPanelSelector,
  dashboardTotalByDriverPanelSelector,
} from './state/dashboard.selectors';
import { dashboardActions } from './state/dashboard.action';
import { AsyncPipe } from '@angular/common';
import { PanelNeighborhoodState, PanelState } from './state/dashboard.reducer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  store = inject(Store);

  totalDataSource$!: Observable<PanelState>;
  failureDataSource$!: Observable<PanelState>;
  progressDataSource$!: Observable<PanelNeighborhoodState>;

  displayedColumns = ['Driver', 'TotalDelivery', 'SuccessDelivery'];
  displayedFailureColumns = ['Driver', 'FailureDelivery'];
  displayedProgressColumns = [
    'Neighborhood',
    'TotalDelivery',
    'SuccessDelivery',
  ];

  ngOnInit(): void {
    this.store.dispatch(dashboardActions.loadTotalByDriverPanel());
    this.store.dispatch(dashboardActions.loadFailurePanel());
    this.store.dispatch(dashboardActions.loadProgressPanel());
    this.totalDataSource$ = this.store.select(
      dashboardTotalByDriverPanelSelector
    );
    this.failureDataSource$ = this.store.select(dashboardFailurePanelSelector);
    this.progressDataSource$ = this.store.select(
      dashboardProgressPanelSelector
    );
  }
}
