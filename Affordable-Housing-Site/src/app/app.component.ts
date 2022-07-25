import { Component } from '@angular/core';
import { productsDB } from './shared/data/products';

@Component({
  selector: 'll-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Affordable-Housing-Site';
  public slides = productsDB.Product;
}
