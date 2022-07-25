import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SwiperModule } from 'swiper/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { EsriMapComponent } from './search/search-list/esri-map/esri-map.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, 
    BrowserAnimationsModule, SharedModule, SwiperModule],
  providers: [EsriMapComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
