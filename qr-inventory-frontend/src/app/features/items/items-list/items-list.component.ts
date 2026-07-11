import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../../shared/models/item.model';
import { ApiService } from '../../../core/services/api.service';
import { CreateItemModalComponent } from '../create-item-modal/create-item-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-list',
  imports: [CommonModule, CreateItemModalComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent {
  @Input() items: Item[] = [];
  @Output() itemDeleted = new EventEmitter<void>();
  @Output() itemCreated = new EventEmitter<void>();
  deletingId: number | null = null;
  showModal = false;
  selectedItem: Item | null = null;

  constructor(private apiservice: ApiService,private router:Router) {}

  editItem(item: any) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onItemCreatedOrUpdated(): void {
    this.itemCreated.emit();
  }

    onModalClosed(): void {
    this.showModal = false;
    this.selectedItem = null;
  }

  deleteItem(id: number): void {
    this.deletingId = id;
    this.apiservice.deleteItem(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.itemDeleted.emit();
          this.deletingId = null;
        } else {
          this.deletingId = null;
        }
      },
      error: (error) => {
        this.deletingId = null;
        console.error('Delete failed', error);
      },
    });
  }

  getStatusClass(item: Item): string {
    let status = '';
    if (item.quantity === 0) status = 'out-of-stock';
    else if (item.quantity <= item.min_quantity) status = 'low-stock';
    else status = 'ok';
    return status;
  }
  getStatusText(item: Item): string {
    let status = '';
    if (item.quantity === 0) status = 'Out of Stock';
    else if (item.quantity <= item.min_quantity) status = 'Low Stock';
    else status = 'OK';
    return status;
  }

   viewItem(item: Item): void {
    this.router.navigate(['/items', item.id]);
  }

}
