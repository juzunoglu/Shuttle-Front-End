import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../_services/admin.service";
import {Driver} from "../../model/driver.model";
import {ConfirmationDialogService} from "../../_services/confirmation-dialog.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PassengerDialogComponent} from "../../Passenger-Logic/passenger-dialog/passenger-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {


  public drivers: Driver[] = [];
  gridColumns = 3;


  constructor(private readonly adminService: AdminService,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly dialog: MatDialog,
              private readonly snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.adminService.getAllDrivers()
      .subscribe(
        (result) => {
          this.drivers = result;
          console.log(this.drivers);
        }
      )
  }

  deleteOnClick(id: string) {
    // @ts-ignore
    this.confirmationDialogService.confirm('Are you sure you want to delete the driver?', this.drivers.find((driver => driver.id == id)).name!)
      .then((res) => {
        if (res) {
          this.adminService.deleteDriver(id)
            .subscribe(() => {
              let index = this.drivers.findIndex(driver => driver.id === id);
              this.drivers.splice(index, 1);
            })
        }
      })
  }

  onClickEdit(driver: Driver) {
    console.log(driver);
  }

  viewPassengers(driver: Driver) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = '40%'
    dialogConfig.width = '35%'
    dialogConfig.data = driver
    this.dialog.open(PassengerDialogComponent, dialogConfig);
  }

}
