import { Component } from '@angular/core';
import { RouthService } from "../Service/routh.service";

@Component({
  selector: 'app-routh',
  templateUrl: './routh.component.html',
  styleUrls: ['./routh.component.scss']
})

export class RouthComponent {
  step = 0;
  degree?: number;
  polynomial: number[] = [];
  coefficients: number[] = [];
  equation?: string;
  construct = false;
  stability: boolean = false;
  rhpRoots?: number;
  routhTable: number[][] = []

  constructor(private routhService: RouthService) { }

  allowConstruction() {
    this.polynomial = [];
    if(this.degree == undefined) return;
    this.construct = true;
    let i = this.degree;
    while (i)
      this.polynomial.push(i--);
    this.polynomial.push(0);
    console.log(this.coefficients);
  }

  postToBackend() {
    this.routhService.sendToBackend(this.coefficients).subscribe((data) => {
      console.log(data);
      this.routhTable = data.routhSolution;
      this.stability = data.isStable;
      this.rhpRoots = data.rootCount;
    });
  }

  clearTable() { 
    this.polynomial = [] ;
    this.construct = false; 
    this.coefficients = []; 
    this.routhTable = []; 
    this.stability = true; 
    this.rhpRoots = 0;
    this.degree = 0;
  }
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }

}
