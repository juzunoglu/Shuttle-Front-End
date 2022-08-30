import {Component, Inject, OnInit} from '@angular/core';
import {PassengerModel} from "../../model/passenger.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../_services/admin.service";
import {Driver} from "../../model/driver.model";

@Component({
  selector: 'app-assigned-driver-view',
  templateUrl: './assigned-driver-view.component.html',
  styleUrls: ['./assigned-driver-view.component.css']
})
export class AssignedDriverViewComponent implements OnInit {

  passenger: PassengerModel | undefined;

  constructor(private dialogRef: MatDialogRef<AssignedDriverViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PassengerModel,
              private readonly driverService: AdminService,
  ) {
    this.passenger = data;
  }
  public assignedDriver = new Driver();

  ngOnInit(): void {
    this.driverService.getDriverByPassengerId(this.passenger?.id!)
      .subscribe((res) => {
        this.assignedDriver = res;
        console.log(this.assignedDriver)
      }, () => {

      });
  }

  close(): void {
    this.dialogRef.close();
  }

}
