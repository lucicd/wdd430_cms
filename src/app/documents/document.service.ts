import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    this.http
      .get<Document[]>('http://localhost:3000/documents')
      .subscribe(
        documents => {
          this.documents = documents;
          this.sortAndSend();
        },
        (error: any) => console.log(error)
      );
  }

  private sortAndSend() {
    this.documents.sort((firstEl, secondEl) => {
      if (+firstEl.id < +secondEl.id) return -1;
      if (+firstEl.id > +secondEl.id) return 1;
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments = (): Document[] => this.documents.slice()

  getDocument(id: string): Document | null {
    const pos = this.documents.findIndex(e => e.id === id);
    return pos < 0 ? null : this.documents[pos];
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex(e => e.id === document.id);
    if (pos < 0) {
      return;
    }
    this.http.delete<{message: string}>('http://localhost:3000/documents/' + document.id)
      .subscribe((data: {message: string}) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();;
      });
  }

  addDocument(newDocument: Document, callback: (id: string) => any): void {
    if (!newDocument) {
      return;
    }
    newDocument.id = '';

    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents', newDocument)
      .subscribe(
        (data: {message: string, document: Document}) => {
          newDocument.id = data.document.id;
          this.documents.push(newDocument);
          this.sortAndSend();
          callback(data.document.id);
        }
      );
  }

  updateDocument(originalDocument: Document | null, newDocument: Document | null, callback: (id: string) => any) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.findIndex(e => e.id === originalDocument.id);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.http.put<{message: string}>('http://localhost:3000/documents/' + originalDocument.id, newDocument)
      .subscribe(
        (data: {message: string}) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
          callback(originalDocument.id);
        }
      );
  }
}
