import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {catchError, from, Observable, tap, throwError} from "rxjs";
import {Driver} from "../model/driver.model";
import {PassengerModel} from "../model/passenger.model";

const ADMIN_API = 'http://localhost:8080/api/v1/driver';

const headers = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root'
})

export class AdminService {


  constructor(private http: HttpClient) {
  }

  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(ADMIN_API + '/create', driver)
      .pipe(
        catchError(this.handleError)
      );
  }

  addDriverPhoto(id: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${ADMIN_API}/${id}/addPhoto`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req)
      .pipe(catchError(this.handleError)
      );
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(ADMIN_API + '/getAllDrivers')
      .pipe(
        catchError(this.handleError)
      );
  }

  getPassengersByDriverId(id: string): Observable<PassengerModel[]> {
    return this.http.get<PassengerModel[]>(`${ADMIN_API}/getAssociatedPassengers/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  deleteDriver(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${ADMIN_API}/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDriverPhoto(id: string): Observable<any> {
    return this.http.get(`${ADMIN_API}/carPhoto/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
