import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RouthService {
  private _url: string = "http://localhost:8080";
  constructor(private http: HttpClient) {}

  sendToBackend(coefficients: any[]) {
    //send the adjacency matrix to the backend
    console.log(coefficients);
    return this.http.post(`${this._url}/routh`, coefficients);
  }
}
