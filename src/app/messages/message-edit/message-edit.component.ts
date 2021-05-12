import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = "Drazen";

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const newMessgae = new Message(42,
      this.subject.nativeElement.value,
      this.msgText.nativeElement.value,
      this.currentSender);
    
    this.onClear();
      
    this.addMessageEvent.emit(newMessgae);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
