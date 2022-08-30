import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {BoardAdminComponent} from './board-admin/board-admin.component';
import {DriverComponent} from "./driver-logic/driver/driver.component";
import {PassengerComponent} from "./Passenger-Logic/passenger/passenger.component";
import {PassengerInfoComponent} from "./Passenger-Logic/passenger-info/passenger-info.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'create-passenger', component: PassengerComponent},
  {path: 'info-passenger', component: PassengerInfoComponent},
  {path: 'admin', component: BoardAdminComponent},
  {path: 'driver', component: DriverComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
