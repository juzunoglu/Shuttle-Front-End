import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {PassengerModel} from "../model/passenger.model";
import {catchError, Observable, throwError} from "rxjs";
import {Driver} from "../model/driver.model";

const PASSENGER_API = 'http://localhost:8080/api/v1/passenger';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  constructor(private http: HttpClient) {
  }

  createPassenger(passenger: PassengerModel): Observable<PassengerModel> {
    return this.http.post<PassengerModel>(PASSENGER_API + '/create', passenger)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePassenger(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${PASSENGER_API}/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllPassengers(): Observable<PassengerModel[]> {
    return this.http.get<PassengerModel[]>(PASSENGER_API + '/getAllPassengers')
      .pipe(
        catchError(this.handleError)
      );
  }

  assignPassengerToDriver(passenger: PassengerModel, id: string): Observable<boolean> {
    return this.http.post<boolean>(`${PASSENGER_API}/assignToDriver/${id}`, passenger)
      .pipe(
        catchError(this.handleError)
      );
  }

  unAssignPassengerFromDriver(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${PASSENGER_API}/removeAssociatedPassenger/${id}`)
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
