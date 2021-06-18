import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactDetailComponent } from "./contacts/contact-detail/contact-detail.component";
import { ContactEditComponent } from "./contacts/contact-edit/contact-edit.component";
import { ContactsResolverService } from "./contacts/contacts-resolver.service";
import { ContactsComponent } from "./contacts/contacts.component";
import { DocumentDetailComponent } from "./documents/document-detail/document-detail.component";
import { DocumentEditComponent } from "./documents/document-edit/document-edit.component";
import { DocumentsResolverService } from "./documents/documents-resolver.service";
import { DocumentsComponent } from "./documents/documents.component";
import { MessageListComponent } from "./messages/message-list/message-list.component";
import { MessagesResolverService } from "./messages/messages-resolver.service";

const appRoutes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentsComponent, children: [
    { path: 'new', component: DocumentEditComponent },
    { 
      path: ':id',
      component: DocumentDetailComponent,
      resolve: [DocumentsResolverService]
    },
    {
      path: ':id/edit',
      component: DocumentEditComponent ,
      resolve: [DocumentsResolverService]
    }
  ] },
  { 
    path: 'messages',
    component: MessageListComponent,
    resolve: [ContactsResolverService, MessagesResolverService]
  },
  { path: 'contacts', component: ContactsComponent, children: [
    { path: 'new', component: ContactEditComponent },
    { 
      path: ':id', 
      component: ContactDetailComponent,
      resolve: [ContactsResolverService]
    },
    { 
      path: ':id/edit',
      component: ContactEditComponent,
      resolve: [ContactsResolverService]
    }
  ] },
  {path: '**', redirectTo: '/documents'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
