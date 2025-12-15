import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    @if (product) {
    <div class="py-8 px-6">
      <div class="max-w-5xl mx-auto">
        <!-- Back Link -->
        <a
          routerLink="/products"
          class="inline-flex items-center gap-2 text-void-400 hover:text-ember-400 transition-colors mb-8 group"
        >
          <app-icon
            name="arrow-left"
            [size]="18"
            class="transition-transform group-hover:-translate-x-1"
          />
          Back to Products
        </a>

        <!-- Product Container -->
        <div class="card overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Product Image -->
            <div
              class="h-80 lg:h-auto bg-gradient-to-br from-void-800 to-void-700 flex items-center justify-center"
            >
              <app-icon
                [name]="getCategoryIcon(product.category)"
                [size]="160"
                class="text-void-400 animate-float"
              />
            </div>

            <!-- Product Info -->
            <div class="p-8 lg:p-10">
              <span class="badge badge-ember mb-4 flex items-center gap-1.5 w-fit">
                <app-icon [name]="getCategoryIcon(product.category)" [size]="10" />
                {{ product.category }}
              </span>

              <h1 class="text-3xl lg:text-4xl font-bold text-void-50 mb-4">
                {{ product.name }}
              </h1>

              <p class="text-void-300 text-lg leading-relaxed mb-8">
                {{ product.description }}
              </p>

              <!-- Price & Stock -->
              <div class="flex items-center gap-6 mb-8">
                <span class="text-4xl font-bold text-void-50">
                  \${{ product.price.toFixed(2) }}
                </span>
                <span
                  [class]="
                    product.inStock
                      ? 'badge-success'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  "
                  class="badge flex items-center gap-2"
                >
                  <app-icon name="circle" [size]="6" />
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>

              <!-- Add to Cart -->
              <button
                [disabled]="!product.inStock"
                (click)="addToCart()"
                [class]="
                  product.inStock
                    ? 'btn-primary'
                    : 'bg-void-600 text-void-400 cursor-not-allowed'
                "
                class="btn w-full mb-8 gap-3"
              >
                <app-icon [name]="product.inStock ? 'cart' : 'bell'" [size]="18" />
                {{ product.inStock ? 'Add to Cart' : 'Notify When Available' }}
              </button>

              <!-- Features -->
              <div class="border-t border-void-500 pt-6">
                <h3 class="text-lg font-semibold text-void-50 mb-4">Features</h3>
                <ul class="space-y-3">
                  @for (feature of features; track feature.text) {
                  <li class="flex items-center gap-3 text-void-300">
                    <app-icon [name]="feature.icon" [size]="18" class="text-emerald-400" />
                    {{ feature.text }}
                  </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <!-- Loading State -->
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
      <app-icon
        name="spinner"
        [size]="40"
        class="text-ember-500 animate-spin mb-4"
      />
      <p class="text-void-400">Loading product...</p>
    </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  product: Product | null = null;

  features: { icon: IconName; text: string }[] = [
    { icon: 'certificate', text: 'Premium quality materials' },
    { icon: 'undo', text: '30-day money back guarantee' },
    { icon: 'truck', text: 'Free shipping on orders over $50' },
    { icon: 'shield', text: '1-year warranty included' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Product>(`/api/products/${id}`).subscribe({
        next: (product) => {
          this.product = product;
        },
      });
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

  addToCart() {
    alert(`Added ${this.product?.name} to cart!`);
  }
}
