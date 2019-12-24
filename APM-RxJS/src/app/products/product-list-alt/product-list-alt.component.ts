import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;
  
  products: Product[] = [];
  sub: Subscription;

  products$=this.productService.productsWithCategory$.pipe(
    catchError(error=>{
      this.errorMessage = error;
      return EMPTY;
    }));
    
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.sub = this.productService.getProducts().subscribe(
    //   products => this.products = products,
    //   error => this.errorMessage = error
    // );
  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

  selectedProduct$ = this.productService.selectedProduct$;
  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
