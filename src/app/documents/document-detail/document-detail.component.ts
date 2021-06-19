import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: Document = {} as Document;
  private subscription: Subscription = {} as Subscription;
  nativeWindow: any = null;

  constructor(
    private documentService: DocumentService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private windRefService: WindRefService) { }

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow();
    const id = this.activatedRoute.snapshot.params['id'];
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      () => {
        this.document = this.documentService.getDocument(id) ?? {} as Document;
      }
    );
    this.document = this.documentService.getDocument(id) ?? {} as Document;
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.document = this.documentService.getDocument(params['id']) ?? {} as Document;
      }
    );
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
