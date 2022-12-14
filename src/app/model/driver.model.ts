import {PassengerModel} from "./passenger.model";

export class Driver {

  id?: string
  name: string | undefined;
  age: number | undefined;
  phoneNumber: number | undefined;
  experience: string | undefined;
  email: string | undefined;
  latitude?: number;
  longitude?: number;
  carPhoto: any;
  carMake: string | undefined;
  carModel: string | undefined;
  carTag: string | undefined;
  isSelected?: boolean;
  passengers?: PassengerModel[];
}
