import {Driver} from "./driver.model";

export interface PassengerModel {
  isSelected?: boolean,
  isEdit?: boolean,
  id?: string,
  name: string,
  age: number,
  phoneNumber: string,
  email: string,
  latitude: number,
  longitude: number,
  driver?: Driver,
}
