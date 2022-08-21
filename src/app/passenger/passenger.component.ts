import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";
import {PassengerModel} from "../model/passenger.model";
import {PassengerService} from "../_services/passenger.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css']
})
export class PassengerComponent implements OnInit {

  title: string = "Passenger's address: "

  // @ts-ignore
  passengerForm: FormGroup;

  passenger: PassengerModel | undefined;

  constructor(private readonly fb: FormBuilder,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly passengerService: PassengerService,
  ) {
  }

  ngOnInit(): void {
    this.initializeAdminPanel();
  }

  getLatLng(location: any) {
    this.passengerForm.controls['passengerLatitude'].setValue(location.lat)
    this.passengerForm.controls['passengerLongitude'].setValue(location.lng)
  }

  onSave(): void {
    this.confirmationDialogService.confirm("Are you sure you want to save the passenger?", this.passengerFullName?.value)
      .then((res) => {
        if (res) {
          this.passenger = {
            name: this.passengerFullName?.value,
            age: this.passengerAge?.value,
            phoneNumber: this.passengerPhoneNumber?.value,
            email: this.passengerEmail?.value,
            latitude: this.passengerLatitude?.value,
            longitude: this.passengerLongitude?.value
          }
          this.passengerService.createPassenger(this.passenger)
            .subscribe((res) => {
              this.passengerForm.reset();
            });
        }
      });
  }


  private initializeAdminPanel(): void {
    this.passengerForm = this.fb.group({
      passengerLatitude: new FormControl('', [
        Validators.required
      ]),
      passengerLongitude: new FormControl('', [
        Validators.required
      ]),
      passengerFullName: new FormControl('', [
        Validators.required
      ]),
      passengerAge: new FormControl('', []),
      passengerPhoneNumber: new FormControl('', [
        Validators.required
      ]),
      passengerEmail: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
    });
  }

  get passengerLatitude() {
    return this.passengerForm.get('passengerLatitude');
  }

  get passengerLongitude() {
    return this.passengerForm.get('passengerLongitude');
  }

  get passengerFullName() {
    return this.passengerForm.get('passengerFullName')
  }

  get passengerAge() {
    return this.passengerForm.get('passengerAge');
  }

  get passengerPhoneNumber() {
    return this.passengerForm.get('passengerPhoneNumber');
  }

  get passengerEmail() {
    return this.passengerForm.get('passengerEmail');
  }

}
