import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-request-response',
  templateUrl: './request-response.component.html',
  styleUrls: ['./request-response.component.css'],
})
export class RequestResponseComponent implements OnInit {
  constructor(
    private clipboardApi: ClipboardService
  ) {}
  responses: any[] = [];
  requests: any[]=[];

  resText: string[]=[];
  ngOnInit(): void {
    this.getResponse();
    this.getRequest();
  }

  reload() {
    this.requests = [];
    this.responses = [];
    this.getResponse();
    this.getRequest();
  }

  copyResponse() {
    this.clipboardApi.copyFromContent(JSON.stringify(this.responses[0][0]));
  }

  getRequest() {
    this.requests.push(sessionStorage.getItem('request'));
  }

  getResponse() {
    const test: string | null = sessionStorage.getItem('response');
    if (typeof test === 'string') {
      this.responses.push(JSON.parse(test));
      console.log(this.responses);
    } else {
      console.log('not a string');
    }
    this.responses[0].forEach((element:any) => {
      this.resText.push(JSON.stringify(element));
    });
    console.log(this.resText);
  }
}
