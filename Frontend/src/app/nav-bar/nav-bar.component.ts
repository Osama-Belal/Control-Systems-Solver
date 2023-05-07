import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Input() navigation_dir: any;
  @Input() router_link: any;
  @Input() tool_tip: any;
  @Input() comp: any;
  @Input() newAction: any;
  @Input() op1: any;
  @Input() op1_tip: any;
  @Input() op2: any;
  @Input() op2_tip: any;
  @Output() node = new EventEmitter<string>();
  @Output() clear = new EventEmitter();
  @Output() opt1 = new EventEmitter();
  @Output() opt2 = new EventEmitter();
  @Output() result = new EventEmitter();
  count = 3;

  add(){this.node.emit("" + this.count++);}
  option_1(){this.opt1.emit();this.count = 0;}
  option_2(){this.opt2.emit();this.count = 0;}
  submit(){this.result.emit();this.count = 0;}

}
