import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY, throwError, of, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  //changeDetection: ChangeDetectionStrategy.
})
export class ProductListComponent implements OnInit{
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction = this.categorySelectedSubject.asObservable();

  selectedCategoryId = 1;
  products$ = combineLatest([
    this.productService.productWithAdd$,
    this.categorySelectedAction
  ])
  .pipe(
    map(([products, selectedCategoryId]) => products.filter(p => selectedCategoryId ? p.categoryId === selectedCategoryId : true)),
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    }));

    categories$ = this.productCategoryService.productCategories$.pipe(
      catchError(error=>{
        this.errorMessage = error;
        return EMPTY;
      }));

  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
   
  }

  onAdd(): void {
    this.productService.productAdded();
  }

  onSelected(categoryId: string): void {
   this.categorySelectedSubject.next(+categoryId);
  }
}
