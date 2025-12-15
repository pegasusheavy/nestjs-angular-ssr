import { Controller, Get, Param, Query } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Mechanical Keyboard',
    description: 'Premium mechanical keyboard with RGB lighting',
    price: 149.99,
    category: 'electronics',
    inStock: true,
  },
  {
    id: 2,
    name: 'Ergonomic Mouse',
    description: 'Wireless ergonomic mouse with precision tracking',
    price: 79.99,
    category: 'electronics',
    inStock: true,
  },
  {
    id: 3,
    name: 'Standing Desk',
    description: 'Electric height-adjustable standing desk',
    price: 599.99,
    category: 'furniture',
    inStock: false,
  },
  {
    id: 4,
    name: 'Monitor Light Bar',
    description: 'LED light bar for reduced eye strain',
    price: 49.99,
    category: 'electronics',
    inStock: true,
  },
  {
    id: 5,
    name: 'Desk Mat',
    description: 'Large premium desk mat with stitched edges',
    price: 29.99,
    category: 'accessories',
    inStock: true,
  },
];

@Controller('api/products')
export class ProductsController {
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('inStock') inStock?: string,
  ): Product[] {
    let result = products;

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (inStock !== undefined) {
      result = result.filter((p) => p.inStock === (inStock === 'true'));
    }

    return result;
  }

  @Get('categories')
  getCategories(): string[] {
    return [...new Set(products.map((p) => p.category))];
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product | { error: string } {
    const product = products.find((p) => p.id === Number(id));
    if (!product) {
      return { error: 'Product not found' };
    }
    return product;
  }
}

