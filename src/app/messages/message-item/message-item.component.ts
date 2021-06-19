import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import {Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit, OnDestroy {
  @Input() message: Message = {} as Message;
  messageSender: string = '';
  private subscription: Subscription = {} as Subscription;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      () => {
        const contact: Contact | null = this.contactService.getContact(this.message.sender);
        this.messageSender = contact?.name ?? 'Unknow contact';
      }
    );
    const contact: Contact | null = this.contactService.getContact(this.message.sender);
    this.messageSender = contact?.name ?? 'Unknow contact';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
