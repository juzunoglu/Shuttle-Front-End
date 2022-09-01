import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PassengerModel} from "../../model/passenger.model";
import {PassengerService} from "../../_services/passenger.service";
import {ConfirmationDialogService} from "../../_services/confirmation-dialog.service";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DriverDialogComponent} from "../../driver-logic/driver-dialog/driver-dialog.component";
import {Driver} from "../../model/driver.model";
import {AdminService} from "../../_services/admin.service";
import {AssignedDriverViewComponent} from "../../driver-logic/assigned-driver-view/assigned-driver-view.component";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.css']
})

export class PassengerInfoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'age', 'phoneNumber', 'email', 'lat', 'lng', 'actions'];
  dataSource = new MatTableDataSource<any>();
  // @ts-ignore
  VOForm: FormGroup;

  constructor(private readonly passengerService: PassengerService,
              private readonly driverService: AdminService,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly dialog: MatDialog,
              private fb: FormBuilder,
              private _formBuilder: FormBuilder) {
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
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([])
    });


    this.passengerService.getAllPassengers()
      .subscribe((res) => {
        this.dataSource.data = res;
        this.VOForm = this.fb.group({
          VORows: this.fb.array(res.map(val => this.fb.group({
              id: new FormControl(val.id),
              name: new FormControl(val.name),
              age: new FormControl(val.age),
              phoneNumber: new FormControl(val.phoneNumber),
              email: new FormControl(val.email),
              lat: new FormControl(val.latitude),
              lng: new FormControl(val.longitude),
              isEditable: new FormControl(true),

              actions: new FormControl('existingRecord'),
              isNewRow: new FormControl(false),
            }),
          )),
        });
        this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
        this.dataSource.paginator = this.paginator;
        const filterPredicate = this.dataSource.filterPredicate;
        this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
          return filterPredicate.call(this.dataSource, data.value, filter);
        };
      });
  }

  doFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(VOFormElement: any, i: number): void {
    console.log(VOFormElement);
    const passengerName = VOFormElement.value.VORows[i].name
    const passengerId = VOFormElement.value.VORows[i].id
    this.confirmationDialogService.confirm("Are you sure you want to delete the passenger?", passengerName)
      .then((res) => {
        if (res) {
          this.passengerService.deletePassenger(passengerId).subscribe(() => {
            VOFormElement.get('VORows').removeAt(i);
            this.dataSource.data = this.dataSource.data.filter(
              (u: PassengerModel) => u.id !== passengerId);
          });
        }
      });
  }

  EditSVO(VOFormElement: any, i: number) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
  }

  SaveVO(VOFormElement: any, i: number) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    const passengerToBeUpdated = VOFormElement.value.VORows[i];
    console.log(passengerToBeUpdated)
    this.confirmationDialogService.confirm("Are you sure you want to update the passenger?", passengerToBeUpdated.name)
      .then((res) => {
        if (res) {
          this.passengerService.updatePassenger(passengerToBeUpdated.id, passengerToBeUpdated)
            .subscribe((res) => console.log(res));
        }
      })
  }

  CancelSVO(VOFormElement: any, i: number) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
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

  assignToDriver(passenger: PassengerModel) {
    console.log(passenger);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = passenger;
    dialogConfig.height = '30%'
    const dialogRef = this.dialog.open(DriverDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((driver: Driver) => {
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

  viewAssignedDrivers(passenger: PassengerModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = passenger;
    dialogConfig.height = '50%'
    this.dialog.open(AssignedDriverViewComponent, dialogConfig);
  }
}
