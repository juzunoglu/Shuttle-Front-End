import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {EmployeeInfo} from "../model/address.model";
import {MapsAPILoader} from "@agm/core";
import {UserInfoService} from "../service/user-info.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  title: string = 'Pick up location:';
  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 0;
  address: string | undefined = "";
  prev: any;
  employeeInfo: EmployeeInfo = new EmployeeInfo();
  private geoCoder: google.maps.Geocoder | undefined;

  // date picker related
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model = [];

  // @ts-ignore
  myForm: FormGroup;

  @ViewChild('search')
  public searchElementRef: ElementRef = new ElementRef("");
  // @ts-ignore
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        // @ts-ignore
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
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
    private ngZone: NgZone,
    private addressService: UserInfoService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 12;
        });
      });
    });
    this.initializeForm();
    this.myForm.valueChanges.subscribe(console.log)
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  public markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat()
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
    console.log('dragEventFinished')
  }

  public clickedMarker(window: any) {
    if (this.prev) {
      this.prev.close();
    }
    this.prev = window;
  }

  public onSend() {
    // this.pickUpAddress.fullAddress = this.address;
    // this.pickUpAddress.latitude = this.latitude;
    // this.pickUpAddress.longitude = this.longitude;
    this.employeeInfo.fullAddress = this.address;
    this.employeeInfo.latitude = this.latitude;
    this.employeeInfo.longitude = this.longitude;
    this.employeeInfo.fullName = this.fullName?.value;
    this.employeeInfo.phoneNumber = this.phoneNumber?.value;
    this.employeeInfo.email = this.email?.value;

    this.addressService.sendUserInfo(this.employeeInfo).subscribe(
      (response) => {
        console.log("Response!: ", response)
      }
    )
    window.alert('Your information has been taken! Thank you...')
  }

  private getAddress(latitude: number, longitude: number) {
    // @ts-ignore
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: { formatted_address: string; }[], status: string) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  private initializeForm(): void {
    this.myForm = this.fb.group({
      fullName: new FormControl(this.employeeInfo.fullName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25)
      ]),
      email: new FormControl(this.employeeInfo.email, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25),
        Validators.email
      ]),
      phoneNumber: new FormControl(this.employeeInfo.phoneNumber, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25),
      ])
    });
  }

  get email() {
    return this.myForm.get('email');
  }

  get fullName() {
    return this.myForm.get('fullName');
  }
  get phoneNumber() {
    return this.myForm.get('phoneNumber');
  }

}
