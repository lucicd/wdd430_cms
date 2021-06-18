import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Message } from './message.model';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolverService implements Resolve<Message[]> {

  constructor(private messageService: MessageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const messages = this.messageService.getMessages();
    if (messages.length === 0) {
      return this.messageService.fetchMessages();
    }
    return messages;
  }
}
