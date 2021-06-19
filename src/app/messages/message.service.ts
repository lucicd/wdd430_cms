import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  private maxMessageId = 0;
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) { 
    this.http
      .get<Message[]>('https://drazen-cms-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => this.updateMessagesList(messages),
        (error: any) => console.log(error)
      );
  }

  private updateMessagesList(messages: Message[]) {
    this.messages = messages;
    this.maxMessageId = this.getMaxId();
    this.messages.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
      return 0;
    });
    this.messageListChangedEvent.next(this.messages.slice());
  }

  storeMessages() {
    this.http
      .put<Message[]>('https://drazen-cms-default-rtdb.firebaseio.com/messages.json', this.messages)
      .subscribe(
        (messages: Message[]) => this.updateMessagesList(messages),
        (error: any) => console.log(error)
      );
  }

  getMessages = (): Message[] => this.messages.slice()

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id)
        return message;
    }
    return null;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }
    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach(element => {
      let currentId = +element.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });   
    return maxId; 
  }

}
