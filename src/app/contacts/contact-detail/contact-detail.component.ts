import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  contact: Contact = {} as Contact;
  private subscription: Subscription = {} as Subscription;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      () => {
        this.contact = this.contactService.getContact(id) ?? {} as Contact;
      }
    );
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.contact = this.contactService.getContact(params['id']) ?? {} as Contact;
      }
    );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
