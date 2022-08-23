import {Component, OnInit} from '@angular/core';
import {AdminService} from "../_services/admin.service";
import {Driver} from "../model/driver.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DriverDialogComponent} from "../driver-dialog/driver-dialog.component";
import {PassengerDialogComponent} from "../passenger-dialog/passenger-dialog.component";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {


  public drivers: Driver[] = [];
  gridColumns = 1;


  constructor(private readonly adminService: AdminService,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.adminService.getAllDrivers()
      .subscribe(
        (result) => {
          result.forEach((value) => {
              this.drivers.push(value);
            }
          )
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
      });
  }

  viewPassengers(driver: Driver) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = '30%'
    dialogConfig.data = driver
    const dialogRef = this.dialog.open(PassengerDialogComponent, dialogConfig);
    console.log(driver);
  }

}
