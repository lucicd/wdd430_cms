import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocumnet: Document | null = <Document>{};
  document: Document = <Document>{};
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
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

}
