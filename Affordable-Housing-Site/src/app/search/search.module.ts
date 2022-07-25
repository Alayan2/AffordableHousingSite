import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { SearchHeroComponent } from './search-list/search-hero/search-hero.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { GoogleMapsModule } from '@angular/google-maps';
import { EsriMapComponent } from "./search-list/esri-map/esri-map.component";
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [SearchListComponent, SearchDetailsComponent, SearchHeroComponent, EsriMapComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    MatExpansionModule,
    MatTabsModule,
    GoogleMapsModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule

  ],
  exports: [EsriMapComponent]
  
})
export class SearchModule { }
