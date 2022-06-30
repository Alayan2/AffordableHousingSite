
import {
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
import * as Map from "esri/Map";
import * as PopupTemplate from "esri/PopupTemplate";
import { productsDB } from "src/app/shared/data/products";
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map

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

  constructor() {}

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

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };
      this.setGraphics(map)

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

  ngOnDestroy() {
    // if (this._view) {
    //   // destroy the map view
    //   this._view.container = null;
    // }
  }

  //sets the markers onto the map by looping through the products database

  private setGraphics(map: esri.Map) {
    loadModules(['esri/layers/GraphicsLayer']).then(([GraphicsLayer]) => { 
      var graphicsLayer = new GraphicsLayer();
  
      map.add(graphicsLayer)

      var simpleMarkerSymbol = {
        type: "simple-marker", //
        color: [0, 136, 60], // orange0/136/60
        size: 20,
        style: "circle",
        outline: {
          color: [255, 255, 255], // white
          width: 2
        }
      };
  
      for (let product of productsDB.Product){
        // Create a point
        loadModules(['esri/geometry/Point']).then(([Point]) => { 
          var point = new Point ({
          longitude: product.lng,
          latitude: product.lat,
        });

        loadModules(['esri/Graphic', 'esri/geometry/support/webMercatorUtils' ]).then(([Graphic, webMercatorUtils]) => {
          var pointGraphic = new Graphic({
          geometry: webMercatorUtils.geographicToWebMercator(point),
          symbol: simpleMarkerSymbol
        });
        
        

        loadModules(['esri/PopupTemplate']).then(([PopupTemplate]) => {
          const template = new PopupTemplate ({
          title: product.name,
            content: [
              {
                // Pass in the fields to display
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "Address",
                    label: "address"
                  }, 
                  {
                    fieldName: "REGION",
                    label: "Region"
                  }
                ]
              }
            ]
          });

          pointGraphic.popupTemplate = template
          pointGraphic.popupTemplate.collapseEnabled = false;

        graphicsLayer.add(pointGraphic);


      }
        )}
      
        )}
    )}
  })
  
    }   
  
  }