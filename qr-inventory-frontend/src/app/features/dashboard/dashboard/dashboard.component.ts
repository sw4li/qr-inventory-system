import { Component, OnInit } from '@angular/core';
import { Item } from '../../../shared/models/item.model';
import { ItemsListComponent } from '../../items/items-list/items-list.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { CreateItemModalComponent } from '../../items/create-item-modal/create-item-modal.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ItemsListComponent,
    CreateItemModalComponent,
    NavbarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error: string | null = null;

  showCreateModal = false;

  stats = {
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  };

  constructor(private apiService: ApiService ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.apiService.getItems().subscribe({
      next: (response) => {
        if (response.success) {
          this.loading = false;
          this.items = response.data;
          this.calculateStats(response);
        } else {
          this.loading = false;
          this.error = response.message;
        }
      },
      error: (error) => {
        this.error = error.error.message;
      },
    });
  }

  calculateStats(response: any): void {
    let lowStock = 0;
    let outOfStock = 0;
    this.items.forEach((data: any) => {
      if (data.quantity === 0) {
        outOfStock++;
      } else if (data.min_quantity >= data.quantity) {
        lowStock++;
      }
    });
    this.stats = {
      totalItems: response.count,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
    };
  }

  onItemDeleted(): void {
    this.loadItems();
  }

  onItemCreated(): void {
    this.showCreateModal = true;
  }

  onModalClosed(): void {
    this.showCreateModal = false;
  }

  onItemCreatedSuccess(): void {
    this.showCreateModal = false;
    this.loadItems();
  }


}
