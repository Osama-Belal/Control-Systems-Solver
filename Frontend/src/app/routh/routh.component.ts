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
  coefficients: number[] = [] ;
  equation? : string ;
  construct = false;
  stability : boolean = true;
  rhpRoots?: number;
  dummyArray = [
    [1 , 2 , 3 , 4 , 5 , 6 ],
    [7, 8, 9, 10 , 11 , 12 ],
    [13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
  ]

  routhTable : number[][] = []

  constructor(private routhService: RouthService) {}

  allowConstruction(){
    this.polynomial = [];
    this.construct = true;
    let i = this.degree;
    while(i)
      this.polynomial.push(i--);
    this.polynomial.push(0);
    console.log(this.coefficients);
  }

  postToBackend(){
    this.routhService.sendToBackend(this.coefficients).subscribe((data) => {
      // to be continued
      console.log(data);
      this.routhTable = data.routhSolution;
      this.stability = data.isStable;
      this.rhpRoots = data.rootCount;
  });
  }

  clearTable() {this.polynomial = []}

  setStep(index: number) {this.step = index;}
  nextStep() {this.step++;}
  prevStep() {this.step--;}
}
