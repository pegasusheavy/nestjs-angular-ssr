import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IconComponent, type IconName } from '../../shared/icon.component';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="py-12 px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold text-void-50 mb-4">
            Products
          </h1>
          <p class="text-void-300 text-lg max-w-xl mx-auto">
            Browse our collection of premium products
          </p>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          @for (cat of categories; track cat) {
          <button
            (click)="filterByCategory(cat)"
            [class]="
              selectedCategory === cat
                ? 'bg-ember-500 text-white border-ember-500'
                : 'bg-void-700/50 text-void-300 border-void-500 hover:border-ember-500 hover:text-ember-400'
            "
            class="px-5 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2"
          >
            @if (cat !== 'all') {
            <app-icon [name]="getCategoryIcon(cat)" [size]="14" />
            }
            {{ cat === 'all' ? 'All Products' : (cat | titlecase) }}
          </button>
          }
        </div>

        <!-- Products Grid -->
        @if (!loading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (product of filteredProducts; track product.id; let i = $index) {
          <a
            [routerLink]="['/products', product.id]"
            class="card card-hover group block"
            [style.animation-delay.ms]="i * 100"
          >
            <!-- Product Image -->
            <div
              class="h-48 bg-gradient-to-br from-void-800 to-void-700 flex items-center justify-center relative overflow-hidden"
            >
              <app-icon
                [name]="getCategoryIcon(product.category)"
                [size]="64"
                class="text-void-400 group-hover:scale-110 group-hover:text-ember-400 transition-all duration-300"
              />
              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-void-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
              >
                <span
                  class="text-sm text-void-50 font-medium flex items-center gap-2"
                >
                  View Details
                  <app-icon name="arrow-right" [size]="12" />
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-5">
              <span
                class="badge badge-ember text-xs mb-3 flex items-center gap-1.5 w-fit"
              >
                <app-icon [name]="getCategoryIcon(product.category)" [size]="10" />
                {{ product.category }}
              </span>
              <h3
                class="text-lg font-semibold text-void-50 mb-2 group-hover:text-ember-400 transition-colors"
              >
                {{ product.name }}
              </h3>
              <p class="text-void-400 text-sm mb-4 line-clamp-2">
                {{ product.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-void-50">
                  \${{ product.price.toFixed(2) }}
                </span>
                <span
                  [class]="product.inStock ? 'text-emerald-400' : 'text-red-400'"
                  class="text-sm font-medium flex items-center gap-1.5"
                >
                  <app-icon name="circle" [size]="6" />
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>
          </a>
          }
        </div>
        } @else {
        <!-- Loading State -->
        <div class="flex flex-col items-center justify-center py-20">
          <app-icon
            name="spinner"
            [size]="40"
            class="text-ember-500 animate-spin mb-4"
          />
          <p class="text-void-400">Loading products...</p>
        </div>
        }

        <!-- Empty State -->
        @if (!loading && filteredProducts.length === 0) {
        <div class="text-center py-20">
          <app-icon name="box" [size]="64" class="text-void-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold text-void-50 mb-2">
            No products found
          </h3>
          <p class="text-void-400 mb-6">Try selecting a different category</p>
          <button (click)="filterByCategory('all')" class="btn btn-secondary">
            View All Products
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  private http = inject(HttpClient);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = ['all', 'electronics', 'furniture', 'accessories'];
  selectedCategory = 'all';
  loading = true;

  ngOnInit() {
    this.http.get<Product[]>('/api/products').subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (p) => p.category === category
      );
    }
  }

  getCategoryIcon(category: string): IconName {
    const icons: Record<string, IconName> = {
      electronics: 'keyboard',
      furniture: 'couch',
      accessories: 'mouse',
    };
    return icons[category] || 'box';
  }
}
