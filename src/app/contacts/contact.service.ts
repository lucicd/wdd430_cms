import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private maxContactId = 0;
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.http
      .get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts')
      .subscribe(
        (data: {message: string, contacts: Contact[]}) => this.updateContactsList(data.contacts),
        (error: any) => console.log(error)
      );
  }

  private updateContactsList(contacts: Contact[]) {
    this.contacts = contacts;
    this.maxContactId = this.getMaxId();
    this.contacts.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  storeContacts() {
    this.http
      .put<Contact[]>('http://localhost:3000/contacts', this.contacts)
      .subscribe(
        (contacts: Contact[]) => this.updateContactsList(contacts),
        (error: any) => console.log(error)
      );
  }

  getContacts = (): Contact[] => this.contacts.slice()

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id)
        return contact;
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.map(e => {return e.id; }).indexOf(contact.id);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact | null, newContact: Contact | null) {
    if (!originalContact || !newContact) {
      return;
    }
    let pos = this.contacts.map(e => {return e.id; }).indexOf(originalContact.id);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(element => {
      let currentId = +element.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });   
    return maxId; 
  }

}
