import {Component, OnInit} from '@angular/core';
import {AdminService} from "../_services/admin.service";
import {Driver} from "../model/driver.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";

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

}
