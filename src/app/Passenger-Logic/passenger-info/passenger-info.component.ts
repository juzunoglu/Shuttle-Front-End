import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PassengerModel} from "../../model/passenger.model";
import {PassengerService} from "../../_services/passenger.service";
import {ConfirmationDialogService} from "../../service/confirmation-dialog.service";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DriverDialogComponent} from "../../driver-dialog/driver-dialog.component";
import {Driver} from "../../model/driver.model";
import {AdminService} from "../../_services/admin.service";
import {PassengerDialogComponent} from "../passenger-dialog/passenger-dialog.component";

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.css']
})

export class PassengerInfoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'age', 'phoneNumber', 'email', 'lat', 'lng', 'actions'];
  dataSource = new MatTableDataSource<PassengerModel>();

  constructor(private readonly passengerService: PassengerService,
              private readonly driverService: AdminService,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly dialog: MatDialog) {

  }

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.passengerService.getAllPassengers()
      .subscribe((res) => {
        this.dataSource.data = res;
      });
  }

  doFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(id: string): void {
    // @ts-ignore
    this.confirmationDialogService.confirm("Are you sure you want to delete the passenger?", this.dataSource.data.find((passenger => passenger.id)).name!)
      .then((res) => {
        if (res) {
          this.passengerService.deletePassenger(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: PassengerModel) => u.id !== id
            );
          });
        }
      });
  }

  removeSelectedRows() {
    const selectedPassengers = this.dataSource.data.filter((p: PassengerModel) => p.isSelected);
    this.confirmationDialogService
      .confirm("Are you sure you want to delete the selected passengers", selectedPassengers.map(it => it.name).toString())
      .then((res) => {
        if (res) {
          const ids = selectedPassengers.map((it) => it.id!)
          ids.forEach((id) => {
            this.passengerService.deletePassenger(id)
              .subscribe(() => {
                this.dataSource.data = this.dataSource.data.filter((u: PassengerModel) => u.id !== id)
              })
          })
        }
      });
  }

  // Todo
  onEdit(passenger: PassengerModel) {
    console.log(passenger);
  }

  assignToDriver(passenger: PassengerModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = passenger;
    dialogConfig.height = '30%'
    const dialogRef = this.dialog.open(DriverDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((driver: Driver) => {
      console.table(passenger.driver)
      if (driver != null) { // user clicked on close if the driver is null
        if (passenger.driver != null) {
          this.confirmationDialogService.confirm(`The passenger is already assigned to the driver: ${passenger.driver.name}`, "Do you still want to continue?")
            .then((confirmed) => {
              if (confirmed) {
                this.passengerService.assignPassengerToDriver(passenger, driver.id!)
                  .subscribe((res: boolean) => console.log(res))
              }
            });
        } else {
          this.passengerService.assignPassengerToDriver(passenger, driver.id!)
            .subscribe();
        }

      }
    });
  }

  viewAssignedDrivers(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = id;
    dialogConfig.height = '30%'
    const dialogRef = this.dialog.open(PassengerDialogComponent, dialogConfig);
    // dialogRef.afterOpened().subscribe(() => {
    //   this.driverService.getDriverByPassengerId(id)
    //     .subscribe((driver: Driver) => console.log(driver))
    // })
  }
}
