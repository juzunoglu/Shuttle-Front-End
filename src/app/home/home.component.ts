import {Component, OnDestroy, OnInit} from '@angular/core';
import {PassengerService} from "../_services/passenger.service";
import {PassengerModel} from "../model/passenger.model";
import {Driver} from "../model/driver.model";
import {AdminService} from "../_services/admin.service";
import {mergeMap, Observable} from "rxjs";
import {RouteModel} from "../model/route.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  title: string = 'Addresses'

  passengers: PassengerModel[] = [];
  drivers: Driver[] = [];
  routes: RouteModel[] = [];

  constructor(private readonly passengerService: PassengerService,
              private readonly driverService: AdminService) {
  }

  ngOnInit(): void {
    this.passengerService.getAllPassengers()
      .subscribe((res) => {
        this.passengers = res
      });

    this.driverService.getAllDrivers()
      .subscribe((drivers) => {
        this.drivers = drivers;
      });

    this.driverService.getRoutes()
      .subscribe((res) => {
        res.map(re => {
          re.color = this.randomColorGenerator();
        });
        this.routes = res;
      });
  }

  ngOnDestroy(): void {
  }


  public randomColorGenerator(): string {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  }

}
