import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <p style="color: #7f8c8d;">Завантаження деталей...</p>
    } @else if (product()) {
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fafafa;">
        <h2 style="color: #2c3e50; margin-top: 0;">{{ product()?.title }}</h2>
        <p style="font-size: 1.2rem; color: #e67e22; font-weight: bold;">
          Ціна: {{ ((product()?.price || 0) * 41).toFixed(0) }} грн
        </p>
        <p><strong>Категорія:</strong> <span style="background: #eef2f7; padding: 3px 8px; border-radius: 4px;">{{ product()?.category }}</span></p>
        <p style="line-height: 1.5; color: #555;"><strong>Опис:</strong> {{ product()?.description }}</p>
        
        @if (product()?.id && (product()?.id)! > 1000) {
          <span style="background: #28a745; color: white; font-size: 0.8rem; padding: 3px 8px; border-radius: 4px;">Локальний товар</span>
        }

        <div style="margin-top: 20px;">
          <a routerLink="/products" style="display: inline-block; padding: 8px 12px; background: #7f8c8d; color: white; border-radius: 4px; font-size: 0.9rem; text-decoration: none;">← Назад до списку</a>
        </div>
      </div>
    } @else {
      <p style="color: #c0392b;">Товар не знайдено.</p>
    }
  `
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id > 1000) {
      const found = this.service.localProducts().find(p => p.id === id);
      if (found) {
        this.product.set(found);
      }
      this.loading.set(false);
    } else if (id) {
      this.service.get(id).subscribe({
        next: (data: Product) => {
          this.product.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }
}