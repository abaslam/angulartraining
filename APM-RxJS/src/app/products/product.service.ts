import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, combineLatest, BehaviorSubject, Subject, merge, from } from 'rxjs';
import { catchError, tap, map, scan, filter, mergeMap, toArray } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  private productSelectedSubject = new BehaviorSubject<number>(0);
    productSelectedAction$ = this.productSelectedSubject.asObservable();

    private productInsertedSubject = new Subject<Product>()
  productInsertedAction$ = this.productInsertedSubject.asObservable();
    
  // products$ =this.http.get<Product[]>(this.productsUrl)
  // .pipe(
  //   map(products=> products.map(product=>({
  //     ...product,
  //     price: product.price * 1.5,
  //     searchKey: [product.productName]
  //   }) as Product)),
  //   tap(data => console.log('Products: ', JSON.stringify(data))),
  //   catchError(this.handleError)
  //);

  products$ =this.http.get<Product[]>(this.productsUrl)
  .pipe(    
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );


  productsWithCategory$ = combineLatest([
    this.products$,
    this.categoryService.productCategories$
  ])
  .pipe(
    map(([products,categories])=>products.map(product=>({
      ...product,
      price: product.price * 1.5,
      category: categories.find(c=>c.id=== product.categoryId).name,
      searchKey: [product.productName]
    }) as Product)),
  )

  // selectedProduct$ = this.productsWithCategory$.pipe(
  //   map(products=> products.find(p=> p.id==5)),
  //   tap(product=> console.log(product))
  // );

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(
      ([products, selectedproductId]) => products.find(p => p.id == selectedproductId)),
    tap(product => console.log(product))
  );

  selectedProductChanged(productId: number){
    this.productSelectedSubject.next(productId);
  }

  productWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedSubject
  ).pipe(
    scan((accumulator:Product[], value: Product)=> [...accumulator, value])
  )

  productAdded(newProduct?: Product){
    this.productInsertedSubject.next(this.fakeProduct());
  }

  // selectedProductSuppliers$ = combineLatest([
  //   this.selectedProduct$,
  //   this.supplierService.suppliers$
  // ]).pipe(
  //   map(([selectedProduct, suppliers])=> suppliers.filter(s=> selectedProduct.supplierIds.includes(s.id)))
  // )

  selectedProductSuppliers$ = this.selectedProduct$.pipe(
    filter(product=> Boolean(product)),
    mergeMap(product=>
     from(product.supplierIds)
     .pipe(
       mergeMap(id=> this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
       toArray()
     )
  ));

  constructor(private http: HttpClient,
              private categoryService: ProductCategoryService,
              private supplierService: SupplierService) { }

  

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
