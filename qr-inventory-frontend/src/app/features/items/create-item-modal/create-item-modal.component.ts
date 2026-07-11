import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-create-item-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-item-modal.component.html',
  styleUrl: './create-item-modal.component.scss',
})
export class CreateItemModalComponent {
  itemForm!: FormGroup;
  @Output() itemCreated = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();
  @Input() item: Item | null = null;
  error: string | null = null;
  loading: boolean = false;
  private allowedPattern = /^[a-zA-Z0-9\-\/ ]*$/;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {
    this.itemForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.allowedPattern),
        ],
      ],
      description: [''],
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      category: [''],
      qrCode: [''],
      location: [''],
      minQuantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
    });
  }

  ngOnInit() {
    if (this.item) {
      this.itemForm.patchValue({
        name: this.item.name,
        description: this.item.description,
        quantity: this.item.quantity,
        category: this.item.category,
        qrCode: this.item.qr_code,
        location: this.item.location,
        minQuantity: this.item.min_quantity,
      });
    }
  }

  blockDecimals(event: KeyboardEvent): void {
    if (['.', ',', 'e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text');
    if (
      clipboardData &&
      (clipboardData.includes('.') || clipboardData.includes(','))
    ) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.itemForm?.valid) {
      this.loading = true;
      if (this.item) {
        this.apiService
          .updateItem(this.item.id, this.itemForm.value)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.itemCreated.emit();
                this.onClose();
              } else {
                this.error = response.message;
              }
              this.loading = false;
            },
            error: (error) => {
              this.error = error.error?.message || 'Failed to update item';
              this.loading = false;
            },
          });
      } else {
        this.apiService.createItem(this.itemForm.value).subscribe({
          next: (response) => {
            this.itemCreated.emit();
            this.onClose();
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.error = error.error.message;
          },
        });
      }
    }
  }

  onClose(): void {
    this.modalClosed.emit();
    this.itemForm.reset();
    this.error = null;
  }

  getModalTitle(): string {
    return this.item ? 'Edit Item' : 'Create New Item';
  }

  getSubmitButtonText(): string {
    if (this.loading) {
      return this.item ? 'Updating...' : 'Creating...';
    }
    return this.item ? 'Update Item' : 'Create Item';
  }

  get name() {
    return this.itemForm.get('name');
  }

  get quantity() {
    return this.itemForm.get('quantity');
  }

  get minQuantity() {
    return this.itemForm.get('minQuantity');
  }
}
