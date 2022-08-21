import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AgmCoreModule} from "@agm/core";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MapsComponent} from './maps/maps.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {BoardAdminComponent} from './board-admin/board-admin.component';
import {BoardUserComponent} from './board-user/board-user.component';
import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFileUploadModule} from "angular-material-fileupload";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {AgmDrawingModule} from "@agm/drawing";
import {DriverComponent} from './driver/driver.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSliderModule} from "@angular/material/slider";
import {MatRadioModule} from "@angular/material/radio";
import { PassengerComponent } from './passenger/passenger.component';
import { PassengerInfoComponent } from './passenger-info/passenger-info.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortModule} from "@angular/material/sort";
import { DriverDialogComponent } from './driver-dialog/driver-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    MapsComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardUserComponent,
    DriverComponent,
    PassengerComponent,
    PassengerInfoComponent,
    DriverDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: '', //todo delete before push
      libraries: ['places', 'drawing', 'geometry']
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatFileUploadModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    AgmDrawingModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSliderModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {
}
