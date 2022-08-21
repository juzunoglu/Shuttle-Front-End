import {Component, Inject, OnInit} from '@angular/core';
import {AdminService} from "../_services/admin.service";
import {Observable} from "rxjs";
import {Driver} from "../model/driver.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PassengerModel} from "../model/passenger.model";
import {MatListOption} from "@angular/material/list";

@Component({
  selector: 'app-driver-dialog',
  templateUrl: './driver-dialog.component.html',
  styleUrls: ['./driver-dialog.component.css']
})
export class DriverDialogComponent implements OnInit {

  passenger: PassengerModel | undefined;

  constructor(
    private dialogRef: MatDialogRef<DriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PassengerModel,
    private readonly driverService: AdminService) {
    this.passenger = data;
  }

  drivers: Driver[] = [];

  ngOnInit(): void {
    this.driverService.getAllDrivers().subscribe((res) => this.drivers = res);
  }
  close(): void {
    this.dialogRef.close();
  }
}
