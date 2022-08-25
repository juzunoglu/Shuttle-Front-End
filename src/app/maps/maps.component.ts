import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {AgmMarker, MapsAPILoader} from "@agm/core";
import {FormGroup,} from "@angular/forms";
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {PassengerModel} from "../model/passenger.model";
import PolyMouseEvent = google.maps.PolyMouseEvent;
import {Driver} from "../model/driver.model";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @Input() title?: string = 'Pick up location:';
  // istanbul latitude/longitude
  @Input() latitude: number = 41.0082;
  @Input() longitude: number = 28.9784;
  @Input() zoom: number = 9;
  @Input() canSendLatLong: boolean = true;
  @Output() locationEvent = new EventEmitter();
  @Input() canSearch = true;

  @Input() passengerCoordinatesArray: PassengerModel[] = [];
  @Input() driverCoordinatesArray: Driver[] = [];

  address: string | undefined = "";
  comingDates: Date[] = []
  prev: any;
  private geoCoder: google.maps.Geocoder | undefined;

  // date picker related
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel: Date = new Date(0);
  public model = [];
  public isDatesPickingAllowed = false;

  // @ts-ignore
  myForm: FormGroup;

  @ViewChild('search')
  public searchElementRef: ElementRef = new ElementRef("");
  // @ts-ignore
  @ViewChild('picker', {static: true}) _picker: MatDatepicker<Date>;

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        // @ts-ignore
        this.model.push(date);
        this.comingDates.push(date)
        console.log(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => {
        };
        this._picker['_componentRef'].instance._calendar.monthView._createWeekCells();
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 12;
        });
      });
    });
  }

  // Get Current Location Coordinates
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }

  public markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat()
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
  }

  sendLngLat() {
    this.locationEvent.emit({lat: this.latitude, lng: this.longitude});
    this.zoom = 14;
  }

  public clickedMarker(window: any) {
    if (this.prev) {
      this.prev.close();
    }
    this.prev = window;
  }

  public lineClick(event: PolyMouseEvent) {
    console.log(event);
  }

  private getAddress(latitude: number, longitude: number) {
    // @ts-ignore
    this.geoCoder.geocode({
      'location': {
        lat: latitude,
        lng: longitude
      }
    }, (results: { formatted_address: string; }[], status: string) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 8;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
}
