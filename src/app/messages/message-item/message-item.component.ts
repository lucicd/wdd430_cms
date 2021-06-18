import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import {Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message = {} as Message;
  messageSender: string = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    const contact: Contact | null = this.contactService.getContact(this.message.sender);
    this.messageSender = contact?.name ?? 'Unknow contact';
  }

}
