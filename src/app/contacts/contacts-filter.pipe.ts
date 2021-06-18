import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[] | null, term: string): Contact[] | null {
    if (!contacts) {
      return contacts;
    }
    let filteredArray: Contact[] = [];
    for (let contact of contacts) {
      if (contact.name.toLowerCase().includes(term.toLowerCase())) {
        filteredArray.push(contact);
      }
    }
    if (filteredArray.length < 1) {
      return contacts;
    }
    return filteredArray;
  }

}
