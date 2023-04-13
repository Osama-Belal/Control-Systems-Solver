import { Component } from '@angular/core';

@Component({
  selector: 'app-routh',
  templateUrl: './routh.component.html',
  styleUrls: ['./routh.component.scss']
})
export class RouthComponent {
  degree?: number ;
  equation? : string ;
  construct = false;

  allowConstruction(){
    this.construct = true;
  }
}
