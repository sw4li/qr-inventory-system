import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Item, Transaction } from '../../../shared/models/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-item-details',
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent {
  item: Item | null = null;
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  itemId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.itemId = params['id'];
      if (this.itemId) {
        this.loadItem();
      }
    });
  }

  loadItem(): void {
    if (!this.itemId) return;

    this.apiService.getItem(this.itemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.item = response.data;
          this.loadTransactions();
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load item';
        this.loading = false;
      },
    });
  }
  loadTransactions(): void {
    if (!this.itemId) return;
    this.apiService.getTransactions().subscribe({
      next: (response) => {
        if (response?.success) {
          console.log(this.itemId);
          
          console.log(response.data);
          
          this.transactions = response.data.filter(
            (t: Transaction) => t.item_id === Number(this.itemId),
          );
          console.log(this.transactions);
        }
      },
      error: (error) => {
        console.error('Failed to load transactions', error);
      },
    });
  }

  getStatusClass(): string {
    if (!this.item) return '';
    if (this.item.quantity === 0) return 'out-of-stock';
    if (this.item.quantity <= this.item.min_quantity) return 'low-stock';
    return 'ok';
  }

  getStatusText(): string {
    if (!this.item) return '';
    if (this.item.quantity === 0) return 'Out of Stock';
    if (this.item.quantity <= this.item.min_quantity) return 'Low Stock';
    return 'OK';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onEdit(): void {
    this.router.navigate(['/dashboard']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this item?')) {
      if (!this.itemId) return;

      this.apiService.deleteItem(this.itemId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Item deleted successfully');
            this.router.navigate(['/dashboard']);
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to delete item';
        },
      });
    }
  }

}
