import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription: Subscription = {} as Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.messageListChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages
      }
    );
    this.messages = this.messageService.getMessages();
  }

  onAddMessage(message: Message) {
    this.messageService.addMessage(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
