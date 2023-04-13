import { Component } from '@angular/core';

@Component({
  selector: 'app-routh',
  templateUrl: './routh.component.html',
  styleUrls: ['./routh.component.scss']
})
export class RouthComponent {
  degree?: number ;
  polynomial: number[] = [];
  equation? : string ;
  construct = false;

  allowConstruction(){
    this.polynomial = [];
    this.construct = true;
    let i = this.degree;
    while(i){
      this.polynomial.push(i--);
    }
    this.polynomial.push(0);
  }
}
