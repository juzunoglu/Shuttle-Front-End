import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PassengerModel} from "../../model/passenger.model";
import {AdminService} from "../../_services/admin.service";
import {Driver} from "../../model/driver.model";
import {PassengerService} from "../../_services/passenger.service";
import {ConfirmationDialogService} from "../../_services/confirmation-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    private readonly driverService: AdminService,
    private readonly passengerService: PassengerService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.driver = data;
  }


  ngOnInit(): void {
    this.driverService.getPassengersByDriverId(this.driver?.id!)
      .subscribe((res) => {
        this.passengers = res;
      })
  }

  unAssign(passenger: PassengerModel) {
    this.confirmationDialogService.confirm("Are you sure you want to unAssign the passenger?", passenger.name)
      .then((confirmed) => {
        if (confirmed) {
          this.passengerService.unAssignPassengerFromDriver(passenger.id!)
            .subscribe((res) => {
              console.log(res)
            });
        }
      }).then(() => {
        window.location.reload();
    }).finally(() => {
      this.snackBar.open('Passenger is un-assigned successfully!', 'Dismiss', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    });
  }
}
