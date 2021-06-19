import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from './document.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  private maxDocumentId = 0;
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    this.http
      .get<Document[]>('https://drazen-cms-default-rtdb.firebaseio.com/documents.json')
      .pipe(
        map((documents: Document[]) => {
          return documents.map((document: Document) => {
            return {
              ...document,
              description: document.description ? document.description : '',
              children: document.children ? document.children : [] as Document[]
            };
          });
        })
      ).subscribe(
        (documents: Document[]) => {
          this.updateDocumentsList(documents);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  private updateDocumentsList(documents: Document[]) {
    this.documents = documents;
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
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

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
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
    const pos = this.documents.map(e => {return e.id; }).indexOf(document.id);
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
    let pos = this.documents.map(e => {return e.id; }).indexOf(originalDocument.id);
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
