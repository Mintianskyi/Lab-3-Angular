import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Список товарів</h2>
    
    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
      @for (p of allProducts(); track p.id) {
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; background-color: #fafafa;">
          <a [routerLink]="['/products', p.id]" style="font-weight: 500; font-size: 1.05rem; color: #0066cc; text-decoration: none;">
            {{ p.title }}
            @if (p.id && p.id > 1000) {
              <span style="background: #28a745; color: white; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Новий</span>
            }
          </a>
          <span style="font-weight: bold; color: #e67e22; background: #fff3e0; padding: 4px 8px; border-radius: 4px;">
            {{ (p.price * 41).toFixed(0) }} грн
          </span>
        </div>
      }
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  serverProducts = signal<Product[]>([]);

  constructor(public service: ProductsService) {}

  get allProducts() {
    return () => [...this.service.localProducts(), ...this.serverProducts()];
  }

  ngOnInit() {
    this.service.list().subscribe((data: Product[]) => {
      this.serverProducts.set(data);
    });
  }
}