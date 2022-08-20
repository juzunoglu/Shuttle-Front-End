import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PassengerModel} from "../model/passenger.model";
import {PassengerService} from "../_services/passenger.service";
import {ConfirmationDialogService} from "../service/confirmation-dialog.service";

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.css']
})

export class PassengerInfoComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  passengers: PassengerModel[];
  displayedColumns: string[] = ['id', 'name', 'age', 'phoneNumber', 'email', 'lat', 'lng', 'actions'];
  dataSource = new MatTableDataSource<PassengerModel>();

  constructor(private readonly passengerService: PassengerService,
              private readonly confirmationDialogService: ConfirmationDialogService) {

  }

  removeSelectedRows() {
    this.confirmationDialogService
      .confirm("Are you sure you want to delete the selected rows", null)
      .then((res) => {
        if (res) {

        }
      })
  }

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.passengerService.getAllPassengers()
      .subscribe((res) => {
        this.dataSource.data = res;
      })
  }

  onDelete(id: string): void {
    this.confirmationDialogService.confirm("Are you sure you want to delete the passenger?", null)
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
}
