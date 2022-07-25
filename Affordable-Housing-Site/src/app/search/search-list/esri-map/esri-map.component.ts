
import {
  Injectable,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { loadModules } from "esri-loader";
import { productsDB } from "src/app/shared/data/products";
import { Product } from "src/app/shared/data/product";
import { energyDB } from "src/app/shared/data/energy";
import esri = __esri; // Esri TypeScript Types
import {ActivatedRoute} from '@angular/router';
import {} from 'esri/popup/FieldInfo';
import {} from 'esri/symbols/SimpleFillSymbol';
import {} from 'esri/popup/content/Content';
import { filter } from "esri/core/promiseUtils";
import * as reactiveUtils from "esri/core/reactiveUtils";



@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
 
@Injectable()
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  
  id: number = 0;

  @ViewChild("mapViewNode", { static: true })
  private mapViewEl!: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = "streets-navigation-vector"; //list of basemaps @ https://developers.arcgis.com/javascript/3/jsapi/esri.basemaps-amd.html#topo
  private _loaded = false;
  private _view!: esri.MapView;
  private _filterVariable = '';

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  //FILTERING MARKERS: sets search string from search bar
  @Input()
  set filterVariable(filterVariable: string) {
    this._filterVariable = filterVariable;
  }

  //FILTERING MARKERS: gets search string from search bar
  get filterVariable(): string {
    return this._filterVariable;
  }
  getProducts(): Product[] {
    return productsDB.Product;
  }
  
  //find one product from the id in the query string
  getProduct(id: number): Product {
    return Product[id];
  }

  constructor(private route: ActivatedRoute) { 
    //pulls product id from url routerlink query
    this.route.params.subscribe(params => {
      this.id = params['id'] - 1;
    });
  }

 

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView] = await loadModules([
        "esri/Map",
        "esri/views/MapView"
      ]);

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      const filterVariable = this._filterVariable

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
      };

      //function that adds points to the map
      this.setGraphics(map, filterVariable)
      
      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);

    });
  }

  notifyMe() {
    console.log(this.filterVariable);
    return true;
  }
  ngOnDestroy() {
    // if (this._view) {
    //   // destroy the map view
    //   this._view.container = null;
    // }
  }

  setTitle(title: String) {
    return  "<font size='1.5'>" + title
  }

  setImgURL(color: String) {
    return  "'https://maps.google.com/mapfiles/ms/icons/" + color + ".png'" 
  }

  private setGraphics(map: esri.Map, filter: string) {
    
    loadModules([
      'esri/layers/GraphicsLayer', 
      'esri/PopupTemplate', 
      'esri/geometry/Point', 
      'esri/Graphic', 
      'esri/geometry/support/webMercatorUtils',
      'esri/popup/FieldInfo',
      'esri/symbols/SimpleFillSymbol',
      'esri/popup/content/Content',
      'esri/symbols/PictureMarkerSymbol',
      'esri/popup/FieldInfo']).then(([GraphicsLayer, PopupTemplate, Point, Graphic, webMercatorUtils, PictureMarkerSymbol, FieldInfo]) => { 
    
        var graphicsLayer = new GraphicsLayer();

        map.add(graphicsLayer)

      for (let energy of energyDB.energy){

        // Create a point
          var point = new Point ({
          longitude: energy.lng,
          latitude: energy.lat,
        });

      }

       for (let product of productsDB.Product){

        //FILTERING MARKERS: this only loads markers that contain filterVariable text from search bar
        //

        if(filter === null) {
          filter = " ";
        }

        if( (product.address.toLowerCase().includes(filter.toLowerCase()))  || product.neighborhood.toLowerCase().includes(filter.toLowerCase()) ) {

            // Create a point
          var point2 = new Point ({
            longitude: product.lng,
            latitude: product.lat
          });

          var propertySymbol = {
            type: 'picture-marker',
            url: "https://maps.google.com/mapfiles/ms/icons/" + product.color + ".png", 
            contentType: 'image/png',
            width: '36px',
            height: '32px',
            xoffset: -10,
            yoffset: 24
            };


          var pointGraphic2 = new Graphic({
            geometry: webMercatorUtils.geographicToWebMercator(point2),
            symbol: propertySymbol
          });

          var homeMarkerTemplate = new PopupTemplate ({
            title: "Property Details",
            content: [
              {
                // Autocasts as new TextContent()
                type: "text",
                text: "<b>" + product.name + "</b><br><b>Units</b>: " + product.beds + "/" + product.baths 
                + "<br><b>Rent</b>: $" + product.price + "/month"
                + "<br><b>Utility Estimate</b>: $" + product.utilityEstimate
                + "<br><br><a href='http://localhost:4200/products/" + product.id + "' style='color: blue;'> Click here for property details.</a>" ,
              },
              {
                type: "media",
                mediaInfos: [
                  {
                    title: "",
                    type: "image", // Autocasts as new ImageMediaInfo()
                    caption: "",
                    // Autocasts as new ImageMediaInfoValue()
                    value: {
                      sourceURL: product.image1
                    }
                  }
                ]
              }, 
              {
                // if attachments are associated with feature, display it.
                // Autocasts as new AttachmentsContent()
                type: "attachments"
              }
            ]
          });

            pointGraphic2.popupTemplate = homeMarkerTemplate

          graphicsLayer.add(pointGraphic2);    

        }
      }
    })
  }
}
