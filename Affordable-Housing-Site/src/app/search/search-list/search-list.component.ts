import { Component, OnInit } from '@angular/core';
import { productsDB } from '../../shared/data/products';
import { FormBuilder } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Routes } from '@angular/router';
import { ProductDetailsComponent } from '../../product/product-details/product-details.component';
import { markersDB } from 'src/app/shared/data/markers';

export const routes: Routes = [
  { path: './products/:id', component: ProductDetailsComponent}
];

@Component({
  selector: 'll-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})



export class SearchListComponent implements OnInit {

  // ARCGIS MAP

    // Set our map properties
    mapCenter = [ -81.379234, 28.538336];
    basemapType = 'streets-navigation-vector';
    mapZoomLevel = 11;

    //variable for search by 'address' or 'neighborhood'
    searchPreference: String = '';

    myControl = new FormControl('');
    // TODO: read results from OrlandoNeighborhoods.csv
    options: string[] = ['33rd Street Industrial','Airport North','Audubon Park','Azalea Park','BalBay','Baldwin Park','Bel Air','Beltway Commerce','Boggy Creek','Bryn Mawr','Callahan','Camellia Gardens','Carver Shores','Catalina','Central Business District','Clear Lake','College Park','Colonialtown Center','Colonialtown North','Colonialtown South','Conway','Countryside','Coytown','Crescent Park','Delaney Park','Dixie Belle','Dover Estates','Dover Manor','Dover Shores East','Dover Shores West','Eagles Nest','East Park','Engelwood Park','Florida Center','Florida Center North','Florida Central North','Haralson Estates','Hibiscus','Holden Heights','Holden Parramore','Johnson Village','Kirkman North','Kirkman South','Lake Cherokee','Lake Como','Lake Copeland','Lake Davis Greenwood','Lake Dot','Lake Eola Heights','Lake Fairview','Lake Formosa','Lake Fredrica','Lake Holden','Lake Mann Estates','Lake Mann Gardens','Lake Nona Central','Lake Nona Estates','Lake Nona South','Lake Richmond','Lake Shore Village','Lake Sunset','Lake Terrace','Lake Underhill','Lake Weldona','Lake Whippoorwill','Lancaster Park','LaVina','Lawsona Fern Creek','Lorna Doone','Malibu Groves','Mariners Village','Mercy Drive','Meridian Park','Metro West','Milk District','Millenia','Monterey','New Malibu','North Lake Park At Lake Nona','North Orange','North Quarter','Orlando Executive Airport','Orlando International Airport','Orwin Manor','Palomar','Park Central','Park Lake Highland','Pershing','Pineloch','Princeton/Silver Star','Randal Park','Richmond Estates','Richmond Heights','Rio Grande Park','Rock Lake','Roosevelt Park','Rose Isle','Rosemont','Rosemont North','Rowena Gardens','Seaboard Industrial','Signal Hill','South Division','Southeastern Oaks','South Eola','South Orange','South Semoran','Southern Oaks','Southport','Spring Lake','Storey Park','The Dovers','The Willows','Thornton Park','Timberleaf','Ventura','Vista East','Vista Park','Wadeview Park','Washington Shores','Wedgewood Groves','West Colonial','Westfield','Windhover' ];
    filteredOptions!: Observable<string[]>;
  
    displayedColumns: string[] = ['name', 'address', 'rent', 'rating'];
    dataSource = productsDB;
  
    //variable for products db
    products: any[] = [];

    markers: any[] = [];

  isLoaded: boolean = false;
  advanceSearchExpanded: boolean = false;

  

  ngOnInit(): void {

    //default searchPreference set to 'address'
    this.searchPreference = '1';

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    setTimeout(() => {
      this.products = productsDB.Product;
      this.markers = markersDB.Markers;
      this.isLoaded = true
    }, 500)
  }

  // changeComboo(event) {
  //   console.log('chnaged', event && event.value);
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}


