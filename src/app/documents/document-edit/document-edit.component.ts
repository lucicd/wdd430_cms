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
  originalDocumnet: Document | null = <Document>{};
  document: Document = <Document>{};
  private subscription: Subscription = {} as Subscription;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      () => {
        this.document = this.documentService.getDocument(id) ?? {} as Document;
      }
    );
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        const id=params['id'];
        if (!id) {
          this.editMode = false;
          return;
        }
        this.originalDocumnet = this.documentService.getDocument(id);
        if (!this.originalDocumnet) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocumnet));
      }
    );
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

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
      this.documentService.updateDocument(this.originalDocumnet, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
