import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  originalDocument: Document | null = <Document>{};
  document: Document = <Document>{};
  private subscription: Subscription = {} as Subscription;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const prepareData = (id:string) => {
      if (!id) {
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(id) ?? {} as Document;
      if (!this.originalDocument) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    }

    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      () => prepareData(this.activatedRoute.snapshot.params['id'])
    );

    this.activatedRoute.params.subscribe(
      (params: Params) => prepareData(params['id'])
    );
  }

  onCancel = () => this.router.navigate(['/documents'])

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url,
      null
    );

    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
