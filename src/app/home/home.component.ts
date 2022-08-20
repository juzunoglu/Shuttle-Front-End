import {Component, OnInit} from '@angular/core';
import {PassengerService} from "../_services/passenger.service";
import {PassengerModel} from "../model/passenger.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title: string = 'Addresses'

  passengers: PassengerModel[] = [];

  constructor(private readonly passengerService: PassengerService) {
  }

  ngOnInit(): void {
    this.passengerService.getAllPassengers()
      .subscribe((res) => {
        this.passengers = res
        console.log(this.passengers)
      })
  }
}
