import { AfterViewInit, Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';
import {productsDB} from '../../shared/data/products';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'll-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit{
  
      //variable for products table
      products: any[] = [];
      //currentSlide: number; 
      theIndex = 0;  
  // ARCGIS MAP
    // Set our map properties
    mapCenter = [ -81.379234, 28.538336];
    basemapType = 'streets-navigation-vector';
    mapZoomLevel = 12;

    title = 'app';
    radioSel:any;
    radioSelected:string = '';
    radioSelectedString:string = '';
    mapsource:string;
  
    form = new FormGroup({
      gender: new FormControl('')
    });
  
    get f(){
      return this.form.controls;
    }

/*
    changeMap(e: any) {

      if(e.target.value == 'map')
       { this.mapsource= "/assets/images/google-maps/energy map.jpg";}
  
      if(e.target.value == 'shopping')
      { this.mapsource= "/assets/images/google-maps/map_restaurant.jpg" ;}
  
      if(e.target.value == 'transit')
       { this.mapsource= "/assets/images/google-maps/map_single_location_bus_stops.jpg" ;}
  
      if(e.target.value == 'commute')
      { this.mapsource= "/assets/images/google-maps/map_bus_route_to_work.jpg" ;}
  
      if(e.target.value == 'schools')
      { this.mapsource= "/assets/images/google-maps/map_schools.jpg" ;}
    }
  */



    //variable for product.id passed from home.component to query database
    id: number = 1;
    
    constructor(private route: ActivatedRoute) { 
      this.mapsource= "/assets/images/google-maps/map_single_location3.jpg"
      
      //reference to the products db
      this.products = productsDB.Product


      //pulls product id from url routerlink query
      this.route.params.subscribe(params => {
        this.id = params['id'];
      });
    }      

  ngOnInit(): void { 
     
  }
  selectMap(e: any){
    mapsource: "/assets/images/google-maps/map_single_location3.jpg"
  }
  public openNewPage() : void {
    window.open("https://ocpaweb.ocpafl.org/parcelsearch/Parcel%20ID/292234135300011", "_self");
  }
  public handleDenial() : void {
    console.log("Done");
  }
  onPrevClick() {
    const previous = this.theIndex - 1;
    this.theIndex = previous < 0 ? 2 : previous;
  }
  onNextClick() {
    const next = this.theIndex + 1;
    this.theIndex = next > 2 ? 0 : next;
  }
}



