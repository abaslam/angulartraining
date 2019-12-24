import { Component } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, map, filter } from 'rxjs/operators';
import { EMPTY, combineLatest } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  //pageTitle = 'Product Detail';
  errorMessage = '';
  product;

  product$ = this.productService.selectedProduct$.pipe(
    catchError(err=>{
      this.errorMessage =err;
      return EMPTY;
    }));
    
    productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
      catchError(err=>{
        this.errorMessage =err;
        return EMPTY;
      }));

      pageTitle$ = this.product$.pipe(
        map((p: Product)=> p ? `Product Details for: ${p.productName}`: null )
      );

      vm$ = combineLatest([
        this.product$,
        this.pageTitle$,
        this.productSuppliers$
      ]).pipe(
        filter(([product])=> Boolean(product)),
        map(([product, pageTitle, productSuppliers])=>({product, pageTitle, productSuppliers}))
      )
    

  constructor(private productService: ProductService) { }

}
