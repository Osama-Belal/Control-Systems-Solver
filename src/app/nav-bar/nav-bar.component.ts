import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() node = new EventEmitter<string>();
  @Output() clear = new EventEmitter();
  @Output() result = new EventEmitter();
  
  count = 0;

  addNode(){this.node.emit("" + this.count++);}
  clearGraph(){this.clear.emit();this.count = 0;}
  submit(){this.result.emit();this.count = 0;}

}
