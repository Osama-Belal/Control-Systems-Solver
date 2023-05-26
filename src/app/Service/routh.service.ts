import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { RouthDTO } from '../routh/routhDTO';

@Injectable({
  providedIn: 'root'
})
export class RouthService {
  private _url: string = "http://localhost:8080";
  constructor(private http: HttpClient) {}

  sendToBackend(coefficients: any[]) {
    //send the adjacency matrix to the backend
    console.log(coefficients);
    let routhDto: RouthDTO = new RouthDTO();
    routhDto.routhCoefficients = coefficients;
    return this.http.post<RouthDTO>(`${this._url}/routh`, routhDto);
  }
}
