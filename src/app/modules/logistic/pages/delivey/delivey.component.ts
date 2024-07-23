import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeliveryPanelState } from './state/delivery.reducer';
import { AsyncPipe } from '@angular/common';
import { deliveryPanelActions } from './state/delivery.action';
import { deliveryPanelSelector } from './state/delivery.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delivey',
  standalone: true,
  imports: [
    MatTableModule, 
    AsyncPipe, 
    MatIconModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './delivey.component.html',
  styleUrl: './delivey.component.scss',
})
export class DeliveyComponent implements OnInit {
  public counter: number = 1;
  store = inject(Store);
  deliveryPanelDataSource$!: Observable<DeliveryPanelState>;
  displayedColumns = ['Driver', 'Neighborhood', 'Status'];

  selectedValue = '';
  valueFilter = '';

  ngOnInit(): void {
    this.store.dispatch(deliveryPanelActions.loadDeliveryPanel({page:this.counter, filter: this.valueFilter, filterType: this.selectedValue}));
    this.deliveryPanelDataSource$ = this.store.select(deliveryPanelSelector);
  }

  public increment() {    
    this.counter++;
    this.dispatch();
  }

  public decrement() {
    if(this.counter > 1) {
      this.counter--;
      this.dispatch();
    }
  }
  
  public dispatch() {
    this.store.dispatch(deliveryPanelActions.loadDeliveryPanel({page:this.counter, filter: this.valueFilter, filterType: this.selectedValue}))
  }
  
  public modelChanged(e: string) {
    this.counter = 1;
    this.dispatch();
  }
}
