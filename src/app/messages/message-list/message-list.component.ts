import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(1, 'Assignment 3 Grades', 'The grades for this assignment have been posted.', 'Bro. Jackson'),
    new Message(2, 'Assignment 3 Due', 'When is assignment 3 due?', 'Steve Jackson'),
    new Message(3, 'Re: Assignment 3 Due', 'Assignment 3 is due on Satruday at 11:30 PM.', 'Bro. Jackson')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
