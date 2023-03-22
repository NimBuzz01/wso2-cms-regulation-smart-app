//shared module, which will be a home to all of our shared modules, components, directives, pipes and services

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from '../component/header/header.component';
import { FooterComponent } from '../component/footer/footer.component';
import { LandingPageComponent } from '../component/landing-page/landing-page.component';
import { RequestResponseComponent } from '../component/request-response/request-response.component';
import { ReactiveFormsModule } from '@angular/forms';
import { APIViewComponent } from '../component/api-view/api-view.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule } from '@angular/forms';
import { ParamComponent } from '../component/api-view/params.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    RequestResponseComponent,
    APIViewComponent,
    ParamComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgxJsonViewerModule, ClipboardModule, FormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    RequestResponseComponent,
    APIViewComponent,
  ]
})
export class SharedModule {}
