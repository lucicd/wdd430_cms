import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Ancient Book', 'De urinarum differencia negocium between 1210 and 1230.', 'https://upload.wikimedia.org/wikipedia/commons/5/5a/De_urinarum_differencia_negocium_between_1210_and_1230_..JPG', []),
    new Document(2, 'TIOBE', 'TIOBE programming communit index', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Tiobeindex.png', []),
    new Document(3, 'Angular Logo', 'Vector logo of Angular, a popular web development framework', 'https://en.wikipedia.org/wiki/Angular_(web_framework)#/media/File:Angular_full_color_logo.svg', []),
    new Document(4, 'Dubrovnik', 'A montage of major Dubrovnik landmarks', 'https://en.wikipedia.org/wiki/Dubrovnik#/media/File:Montage_of_major_Dubrovnik_landmarks.jpg', []),
    new Document(5, 'Africa Twin', 'Honda CRF 1000L (Africa Twin)', 'https://en.wikipedia.org/wiki/Honda_Africa_Twin#/media/File:Honda_CRF1000L_front-left_2016_Auto_China.jpg', [])
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
