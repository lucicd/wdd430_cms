import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact | null = <Contact>{};
  contact: Contact = <Contact>{};
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  currentInclusion: boolean = false;
  duplicateInclusion: boolean = false;

  constructor(
    private contactService: ContactService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          const id=params['id'];
          if (!id) {
            this.editMode = false;
            return;
          }
          this.originalContact = this.contactService.getContact(id);
          if (!this.originalContact) {
            return;
          }
          this.editMode = true;
          this.contact= JSON.parse(JSON.stringify(this.originalContact));
          
          if (this.contact.group) {
            this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
          }
        }
      );
    }

  onCancel() {
    this.router.navigate(['contacts', this.contact.id]);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts.slice()
    );

    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['contacts', newContact.id]);
  }

  private isInvalidContact(newContact: Contact | null) {
    if (!newContact) {
      return true;
    }
    this.currentInclusion = false;
    this.duplicateInclusion = false;
    if (this.contact && newContact.id === this.contact.id) {
      this.currentInclusion = true;
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        this.duplicateInclusion = true;
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
  }

}
