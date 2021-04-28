import { Component, OnInit } from '@angular/core';
import { Contact } from '../../shared/contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [
    new Contact(
      1, 
      "R. Kent Jackson", 
      "jacksonk@byui.edu",
      "208-496-3771",
      // "https://web.byui.edu/Directory/Employee/jacksonk.jpg",
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      null),
    new Contact(
      2, 
      "Rex Barzee", 
      "barzeer@byui.edu",
      "208-496-3768",
      // "https://web.byui.edu/Directory/Employee/barzeer.jpg",
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      null),
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
