import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Додати новий товар</h3>
    
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
      
      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Назва товару:</label>
        <input formControlName="title" placeholder="Наприклад: Ноутбук" style="width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Ціна (грн):</label>
        <input type="number" formControlName="price" placeholder="999.99" style="width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Категорія:</label>
        <input formControlName="category" placeholder="електроніка" style="width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Опис:</label>
        <textarea formControlName="description" rows="3" placeholder="Короткий опис..." style="width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"></textarea>
      </div>

      <button type="submit" [disabled]="productForm.invalid" style="padding: 10px; background-color: #27ae60; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
        Зберегти товар
      </button>
    </form>

    @if (successMessage) {
      <div style="background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 10px; border-radius: 4px; margin-top: 15px;">
        {{ successMessage }}
      </div>
    }
  `
})
export class ProductFormComponent {
  productForm: FormGroup;
  successMessage = '';

  constructor(private fb: FormBuilder, private service: ProductsService) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.service.create(this.productForm.value).subscribe(() => {
        this.successMessage = 'Товар успішно створено та додано до списку!';
        this.productForm.reset();
      });
    }
  }
}