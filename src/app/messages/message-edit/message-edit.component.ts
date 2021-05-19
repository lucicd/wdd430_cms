import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef = {} as ElementRef;
  @ViewChild('msgText') msgText: ElementRef = {} as ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = '42';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const newMessgae = new Message('42',
      this.subject.nativeElement.value,
      this.msgText.nativeElement.value,
      this.currentSender);

    this.messageService.addMessage(newMessgae);
    
    this.onClear();
      
    this.addMessageEvent.emit(newMessgae);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
