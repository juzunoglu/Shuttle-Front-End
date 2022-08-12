import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../_services/admin.service";
import {Observable} from "rxjs";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Driver} from "../model/driver.model";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  // @ts-ignore
  adminForm: FormGroup;
  // @ts-ignore
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
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
    this.initiliazeAdminPanel();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
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
              // this.fileInfos = this.adminService.getDriverPhoto(this.driverId!);
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

  private initiliazeAdminPanel(): void {
    this.adminForm = this.fb.group({
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
      driverEmail: new FormControl('', []),
      driverCarInfo: this.fb.group({
        make: [''],
        model: [''],
        photo: [null],
        tag: ['', Validators.required]
      })
    });
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
  get driverCarPhoto() {
    return this.adminForm.get('driverCarInfo.file');
  }

  get driverCarTag() {
    return this.adminForm.get('driverCarInfo.tag');
  }
}
