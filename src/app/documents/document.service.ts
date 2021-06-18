import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  private maxDocumentId = 0;
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  fetching = false;

  constructor(private http: HttpClient) {}

  private updateDocumentsList(documents: Document[]) {
    this.documents = documents;
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((firstEl, secondEl) => {
      if (firstEl.name < secondEl.name) return -1;
      if (firstEl.name > secondEl.name) return 1;
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  storeDocuments() {
    this.http
      .put<Document[]>('https://drazen-cms-default-rtdb.firebaseio.com/documents.json', this.documents)
      .subscribe(
        (documents: Document[]) => {
          this.updateDocumentsList(documents);
        },
        (error: any) => {
          console.log(error);
        });
  }

  getDocuments(): void {
    this.fetching = true;
    this.http
      .get<Document[]>('https://drazen-cms-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: Document[]) => {
          this.updateDocumentsList(documents);
          this.fetching = false;
        },
        (error: any) => {
          this.fetching = false;
          console.log(error);
        }
      );
  }

  getDocument(id: string): Document | null {
    console.log(this.fetching);
    // while (this.fetching) {
      
    // }
    for (const document of this.documents) {
      if (document.id === id)
        return document;
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document | null, newDocument: Document | null) {
    if (!originalDocument || !newDocument) {
      return;
    }
    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(element => {
      let currentId = +element.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });   
    return maxId; 
  }

}
