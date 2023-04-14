import { Component } from '@angular/core';
import {RouthService} from "../Service/routh.service";

@Component({
  selector: 'app-routh',
  templateUrl: './routh.component.html',
  styleUrls: ['./routh.component.scss']
})
export class RouthComponent {
  step = 0;

  degree?: number ;
  polynomial: number[] = [];
  equation? : string ;
  construct = false;

  constructor(private routhService: RouthService) {}

  allowConstruction(){
    this.polynomial = [];
    this.construct = true;
    let i = this.degree;
    while(i)
      this.polynomial.push(i--);
    this.polynomial.push(0);
    this.routhService.sendToBackend(this.polynomial);
  }

  clearTable() {this.polynomial = []}

  setStep(index: number) {this.step = index;}
  nextStep() {this.step++;}
  prevStep() {this.step--;}
}
