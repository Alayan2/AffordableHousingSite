
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
import { ActivatedRoute } from '@angular/router';
import * as GraphicsLayer from 'esri/layers/GraphicsLayer';
import * as Point from 'esri/geometry/Point';
import * as Graphic from 'esri/Graphic';
import * as webMercatorUtils from 'esri/geometry/support/webMercatorUtils';
import { } from 'esri/popup/FieldInfo';
import { } from 'esri/symbols/SimpleFillSymbol';
import { } from 'esri/popup/content/Content';



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

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
      };

      //function that adds points to the map
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

  setTitle(title: String) {
    return "<font size='1.5'>" + title
  }

  private setGraphics(map: esri.Map) {

    loadModules([
      'esri/layers/GraphicsLayer',
      'esri/PopupTemplate',
      'esri/geometry/Point',
      'esri/Graphic',
      'esri/geometry/support/webMercatorUtils',
      'esri/popup/FieldInfo',
      'esri/symbols/SimpleFillSymbol',
      'esri/popup/content/Content']).then(([GraphicsLayer, PopupTemplate, Point, Graphic, webMercatorUtils]) => {

        var graphicsLayer = new GraphicsLayer();

        map.add(graphicsLayer)

        for (let energy of energyDB.energy) {
          // Create a point
          var point = new Point({
            longitude: energy.lng,
            latitude: energy.lat,
          });

          var SimpleFillSymbol = {
            type: "simple-marker", //
            color: energy.color,
            size: energy.cirlceSize,
            style: "marker",
            Text: energy.energyRating,
            outline: {
              color: energy.color,
              width: 1
            },
            label: energy.energyRating
          };
          var pointGraphic = new Graphic({
            geometry: webMercatorUtils.geographicToWebMercator(point),
            symbol: SimpleFillSymbol
          });
          /*
                    var template = new PopupTemplate ({
                   title: this.setTitle(product.name),
                     // title: "Property Details",
                    content: [{
                      type: "text",
                      text: 
                      "<table ><tr><th style='border: 1px solid grey; padding: 10px''>Name:  </th> <td style='border: 1px solid grey; padding: 10px''> <a href='localhost:4200/contacts' style='color: #004B8D;'>" + product.name + "</a></td></tr>" +
                      "<tr><th style='border: 1px solid grey; padding: 10px''>Address:  </th><td style='border: 1px solid grey; padding: 10px'>" + product.address + "</td></tr></table>"
                    }]
                  })
                    ;
          
                    pointGraphic.popupTemplate = template
          */
          var pointGraphic2 = new Graphic({
            geometry: webMercatorUtils.geographicToWebMercator(point),
            symbol: SimpleFillSymbol
          });

          graphicsLayer.add(pointGraphic);

        }

        for (let product of productsDB.Product) {
          // Create a point
          var point2 = new Point({
            longitude: product.lng,
            latitude: product.lat
          });

          var PropertySymbol2 = {
            type: "simple-marker", //
            color: [251, 52, 153],
            size: 15,
            style: "square",
            text:
              "<table ><tr><th style='border: 1px solid grey; padding: 10px''>Name:  </th> <td style='border: 1px solid grey; padding: 10px''> <a href='localhost:4200/contacts' style='color: #004B8D;'>" + product.name + "</a></td></tr>" +
              "<tr><th style='border: 1px solid grey; padding: 10px''>Address:  </th><td style='border: 1px solid grey; padding: 10px'>" + product.address + "</td></tr></table>",
            outline: {
              color: [0, 0, 255], // black
              width: 1
            }
          };
          var pointGraphic2 = new Graphic({
            geometry: webMercatorUtils.geographicToWebMercator(point2),
            symbol: PropertySymbol2
          });

          var template = new PopupTemplate({
            title: this.setTitle(product.name),
            // title: "Property Details",
            content: [{
              type: "text",
              text:
                "<table ><tr><th style='border: 1px solid grey; padding: 10px''>Name:  </th> <td style='border: 1px solid grey; padding: 10px''> <a href='localhost:4200/contacts' style='color: #004B8D;'>" + product.name + "</a></td></tr>" +
                "<tr><th style='border: 1px solid grey; padding: 10px''>Address:  </th><td style='border: 1px solid grey; padding: 10px'>" + product.address + "</td></tr></table>"
            }]
          });
          pointGraphic2.popupTemplate = template

          graphicsLayer.add(pointGraphic2);

        }



      })
  }
}
