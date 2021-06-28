import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) { 
    this.http
      .get<{message: string, messages: Message[]}>('http://localhost:3000/messages')
      .subscribe(
        (data: {message: string, messages: Message[]}) => {
          this.messages = data.messages;
          this.sortAndSend();
        },
        (error: any) => console.log(error)
      );
  }

  private sortAndSend() {
    this.messages.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
      return 0;
    });
    this.messageListChangedEvent.next(this.messages.slice());
  }

  getMessages = (): Message[] => this.messages.slice()

  getMessage(id: string): Message | null {
    const pos = this.messages.findIndex(e => e.id === id);
    return pos < 0 ? null : this.messages[pos];
  }

  addMessage(newMessage: Message, callback: (id: string) => any): void {
    if (!newMessage) {
      return;
    }
    newMessage.id = '';

    this.http.post<{ message: string, createdMessage: Message }>('http://localhost:3000/messages', newMessage)
      .subscribe(
        (data: {message: string, createdMessage: Message}) => {
          newMessage.id = data.createdMessage.id;
          this.messages.push(newMessage);
          this.sortAndSend();
          callback(data.createdMessage.id);
        }
      );
  }
}
