import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../_services/admin.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Driver} from "../model/driver.model";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";
import {AgmMarker} from "@agm/core";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  title: string = "Driver's address"

  // @ts-ignore
  adminForm: FormGroup;
  // @ts-ignore
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  isAdminFormSubmitted: boolean = false;
  isFileUploaded: boolean = false;
  driver: Driver = new Driver();
  driverId?: string

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminService: AdminService,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  ngOnInit(): void {
    this.initializeAdminPanel();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  getLatLng(location: any) {
    this.adminForm.controls['driverLatitude'].setValue(location.lat)
    this.adminForm.controls['driverLongitude'].setValue(location.lng)
  }

  onSave(): void {
    this.confirmationDialogService.confirm("Are you sure you want to save the driver?", null)
      .then((res) => {
        if (res) {
          this.driver.name = this.driverFullName?.value;
          this.driver.age = this.driverAge?.value;
          this.driver.phoneNumber = this.driverPhoneNumber?.value;
          this.driver.experience = this.driverExperience?.value;
          this.driver.email = this.driverEmail?.value;
          this.driver.carMake = this.driverCarMake?.value;
          this.driver.carModel = this.driverCarModel?.value;
          this.driver.carTag = this.driverCarTag?.value;
          this.driver.latitude = this.driverLatitude?.value;
          this.driver.longitude = this.driverLongitude?.value;
          this.adminService.createDriver(this.driver).subscribe(
            (res) => {
              this.driverId = res.id;
              this.isAdminFormSubmitted = true;
              console.log(this.driverId);
              this.adminForm.reset();
            },
            () => {
              this.isAdminFormSubmitted = false;
            }
          );
        }
      })
  }

  uploadPhoto(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.adminService.addDriverPhoto(this.driverId!, this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            this.isFileUploaded = true;
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
      window.location.reload();
    }
  }

  private initializeAdminPanel(): void {
    this.adminForm = this.fb.group({
      driverLatitude: new FormControl('', [
        Validators.required
      ]),
      driverLongitude: new FormControl('', [
        Validators.required
      ]),
      driverFullName: new FormControl('', [
        Validators.required
      ]),
      driverAge: new FormControl('', [
        Validators.required
      ]),
      driverPhoneNumber: new FormControl('', [
        Validators.required
      ]),
      driverExperience: new FormControl('', []),
      driverEmail: new FormControl('', [
        Validators.required,
      ]),
      driverCarInfo: this.fb.group({
        make: [''],
        model: [''],
        photo: [null],
        tag: ['', Validators.required]
      })
    });
  }

  get driverLatitude() {
    return this.adminForm.get('driverLatitude');
  }

  get driverLongitude() {
    return this.adminForm.get('driverLongitude');
  }

  get driverFullName() {
    return this.adminForm.get('driverFullName')
  }

  get driverAge() {
    return this.adminForm.get('driverAge');
  }

  get driverPhoneNumber() {
    return this.adminForm.get('driverPhoneNumber');
  }

  get driverExperience() {
    return this.adminForm.get('driverExperience');
  }

  get driverEmail() {
    return this.adminForm.get('driverEmail');
  }

  get driverCarMake() {
    return this.adminForm.get('driverCarInfo.make');
  }

  get driverCarModel() {
    return this.adminForm.get('driverCarInfo.model');
  }

  get driverCarTag() {
    return this.adminForm.get('driverCarInfo.tag');
  }
}
