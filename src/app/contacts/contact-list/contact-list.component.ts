import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {

  contacts: Contact[] = [];
  private subscription: Subscription = {} as Subscription;

  constructor(private contactService: ContactService) { }
  
  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactList: Contact[]) => {
        this.contacts = contactList;
      }
    );

    // this.contactService.contactChangedEvent.subscribe(
    //   (contacts: Contact[]) => {
    //     this.contacts = contacts;
    //   }
    // );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

}
