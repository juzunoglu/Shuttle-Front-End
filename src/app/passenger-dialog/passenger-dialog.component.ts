import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PassengerModel} from "../model/passenger.model";
import {AdminService} from "../_services/admin.service";
import {Driver} from "../model/driver.model";

@Component({
  selector: 'app-passenger-dialog',
  templateUrl: './passenger-dialog.component.html',
  styleUrls: ['./passenger-dialog.component.css']
})
export class PassengerDialogComponent implements OnInit {

  driver: Driver | undefined;
  passengers: PassengerModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<PassengerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Driver,
    private readonly driverService: AdminService
  ) {
    this.driver = data;
  }


  ngOnInit(): void {
    this.driverService.getDriverByPassengerId(this.driver?.id!)
      .subscribe((res) => {
        this.passengers = res;
      })
  }

}
