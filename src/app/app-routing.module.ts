import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APIViewComponent } from './component/api-view/api-view.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ClipboardModule } from 'ngx-clipboard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {path: 'api-view', component: APIViewComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgxJsonViewerModule,
    ClipboardModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
