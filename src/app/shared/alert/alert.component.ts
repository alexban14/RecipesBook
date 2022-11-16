import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  // to make it settable from outside
  @Input() message: string;
  // emitting an event that is accesable from outside
  @Output() close = new EventEmitter<void>();

  constructor() { }

  onClose() {
    this.close.emit();
  }

}
