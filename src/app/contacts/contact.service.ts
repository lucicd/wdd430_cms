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
        (data: {message: string, contacts: Contact[]}) => {
          this.contacts = data.contacts;
          this.sortAndSend();
        },
        (error: any) => console.log(error)
      );
  }

  private sortAndSend() {
    this.contacts.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts = (): Contact[] => this.contacts.slice()

  getContact(id: string): Contact | null {
    const pos = this.contacts.findIndex(e => e.id === id);
    return pos < 0 ? null : this.contacts[pos];
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex(e => e.id === contact.id);
    if (pos < 0) {
      return;
    }
    this.http.delete<{message: string}>('http://localhost:3000/contacts/' + contact.id)
      .subscribe((data: {message: string}) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();;
      });
  }

  addContact(newContact: Contact, callback: (id: string) => any): void {
    if (!newContact) {
      return;
    }
    newContact.id = '';

    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts', newContact)
      .subscribe(
        (data: {message: string, contact: Contact}) => {
          newContact.id = data.contact.id;
          this.contacts.push(newContact);
          this.sortAndSend();
          callback(data.contact.id);
        }
      );
  }

  updateContact(originalContact: Contact | null, newContact: Contact | null, callback: (id: string) => any) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex(e => e.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.http.put<{message: string}>('http://localhost:3000/contacts/' + originalContact.id, newContact)
      .subscribe(
        (data: {message: string}) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
          callback(originalContact.id);
        }
      );
  }
}
