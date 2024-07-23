import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Panel } from '../pages/dashboard/state/models/panel.model';
import { PanelNeighborhood } from '../pages/dashboard/state/models/panel-by-neighborhood.model';
import { DeliveryPanelResult } from '../pages/delivey/state/models/delivery-panel-result.model';

@Injectable({
  providedIn: 'root',
})
export class LogisticService {
  private baseUrl = './../../../../assets/logistic-data.json';
  private http = inject(HttpClient);
  
  getLogisticDataTotalByDriver(): Observable<Panel[]> {
    return this.http.get(this.baseUrl)
      .pipe(
        map((data) => this.processData(data as any[]))
      );
  }
  
  getLogisticDataFailureByDriver(): Observable<Panel[]> {
    return this.http.get(this.baseUrl)
      .pipe(
        map((data) => this.processData(data as any[]))
      );
  }
  
  getLogisticDataTotalByNeighborhood(): Observable<PanelNeighborhood[]> {
    return this.http.get(this.baseUrl)
      .pipe(
        map((data) => this.processDataByNeighborhood(data as any[]))
      );
  }
 
  getLogisticDataDelivery(page: number = 1, filter: string, filterType: string): Observable<DeliveryPanelResult> {
    return this.http.get(this.baseUrl)
      .pipe(
        map((data) => this.processDataDelivery(data as any[], page, filter, filterType))
      );
  }

  private processData(data: any[]): Panel[] {
    const panelsMap = new Map<string, Panel>();
  
    data.forEach(delivery => {
      const motorista = delivery.motorista?.nome;
      const status = delivery.status_entrega; 

      if (!panelsMap.has(motorista)) {
        panelsMap.set(motorista, {
          driver: motorista,
          totalAmount: 0,
          successAmount: 0,
          failureAmount: 0
        });
      }

      panelsMap.get(motorista)!.totalAmount++; 

      if (status === 'ENTREGUE') {
        panelsMap.get(motorista)!.successAmount++;
      } else if (status === 'INSUCESSO') {
        panelsMap.get(motorista)!.failureAmount++;
      }
    });
  
    return Array.from(panelsMap.values());
  }

  private processDataByNeighborhood(data: any[]): PanelNeighborhood[] {
    const neighborhoodsMap = new Map<string, PanelNeighborhood>();

    data.forEach(delivery => {
        const { cliente_destino, motorista, status_entrega } = delivery;
        const neighborhood = cliente_destino.bairro;

        if (!neighborhoodsMap.has(neighborhood)) {
            neighborhoodsMap.set(neighborhood, {
                neighborhood,
                drivers: [],
                totalAmount: 0,
                successAmount: 0,
                failureAmount: 0
            });
        }

        const panelNeighborhood = neighborhoodsMap.get(neighborhood)!;

        if (!panelNeighborhood.drivers.includes(motorista.nome)) {
            panelNeighborhood.drivers.push(motorista.nome);
        }

        panelNeighborhood.totalAmount++;
        if (status_entrega === 'ENTREGUE') {
            panelNeighborhood.successAmount++;
        } else if (status_entrega === 'INSUCESSO') {
            panelNeighborhood.failureAmount++;
        }

        neighborhoodsMap.set(neighborhood, panelNeighborhood);
    });

    const panelNeighborhoods: PanelNeighborhood[] = [];
    neighborhoodsMap.forEach(value => panelNeighborhoods.push(value));

    return panelNeighborhoods;
  }

  private processDataDelivery(data: any[], page: number, filter: string, filterType: string): DeliveryPanelResult {
    var result;
    if (filter != '' && filterType != '') {
      if(filterType == 'driver') {
        result = data.filter(v => v.motorista.nome.toUpperCase().includes(filter.toUpperCase())) .map(item => ({
          driver: item.motorista.nome,
          neighborhood: item.cliente_destino.bairro,
          status: item.status_entrega
        }));
      } else {
        result = data.filter(v => v.status_entrega.toUpperCase().includes(filter.toUpperCase())) .map(item => ({
          driver: item.motorista.nome,
          neighborhood: item.cliente_destino.bairro,
          status: item.status_entrega
        }));
      }      
    } else {
      result = data.map(item => ({
        driver: item.motorista.nome,
        neighborhood: item.cliente_destino.bairro,
        status: item.status_entrega
      }));
    }

    var sliced = result.slice((page - 1)*10, (page*10));
    var delivery = {
      deliveryPanel: sliced,
      totalPages: Math.ceil(data.length/10),    
    };
    return delivery;
  }
}
