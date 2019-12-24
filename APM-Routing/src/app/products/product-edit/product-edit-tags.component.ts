import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../product';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './product-edit-tags.component.html'
})
export class ProductEditTagsComponent implements OnInit {
  @ViewChild(NgForm, {static: false}) productForm: NgForm;
  errorMessage: string;
  newTags = '';
  product = { id: 1, category: 'test', tags: ['test'] };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {
      if (this.productForm) {
        this.productForm.reset();
      }

      this.product = data['resolvedProduct'].product;
    });
  }

  // Add the defined tags
  addTags(): void {
    if (!this.newTags) {
      this.errorMessage = 'Enter the search keywords separated by commas and then press Add';
    } else {
      const tagArray = this.newTags.split(',');
      this.product.tags = this.product.tags ? this.product.tags.concat(tagArray) : tagArray;
      this.newTags = '';
      this.errorMessage = '';
    }
  }

  // Remove the tag from the array of tags.
  removeTag(idx: number): void {
    this.product.tags.splice(idx, 1);
  }
}
