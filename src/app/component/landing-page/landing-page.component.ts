import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import config from '../../../assets/config/config.json';
import { UntypedFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray, FormControl } from '@angular/forms';
import { Session } from 'selenium-webdriver';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  profileForm = this.fb.group({
    baseUrl: [],
    consumerKey: [],
    consumerSecret: [],
    redirectUri: [],
    patient: [],
    practitionerMode: false,
  });

  selectedOption!: string;

  options = config.testPatients;

  public disableField: boolean = config.disableField;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: UntypedFormBuilder
  ) {}

  async onSubmit() {
    let baseUrl = config.baseUrl;
    if (this.profileForm.value.baseUrl != null) {
      baseUrl = this.profileForm.value.baseUrl;
    }
    let consumerKey = config.consumerKey;
    if (this.profileForm.value.consumerKey != null) {
      consumerKey = this.profileForm.value.consumerKey;
    }
    let consumerSecret = config.consumerSecret;
    if (this.profileForm.value.consumerSecret != null) {
      consumerSecret = this.profileForm.value.consumerSecret;
    }
    let redirectUri = config.redirectUri;
    if (this.profileForm.value.redirectUri != null) {
      redirectUri = this.profileForm.value.redirectUri;
    }
    const practitionerMode = this.profileForm.value.practitionerMode;

    sessionStorage.setItem('baseUrl', baseUrl);
    sessionStorage.setItem('consumerKey', consumerKey);
    sessionStorage.setItem('consumerSecret', consumerSecret);
    sessionStorage.setItem('redirectUri', redirectUri);
    sessionStorage.setItem('practitionerMode', practitionerMode);
    sessionStorage.setItem('patient', this.selectedOption);

    await this.getEndpoints(baseUrl + '/.well-known/smart-configuration');

    let practMode: boolean =
      sessionStorage.getItem('practitionerMode') == 'true';
    if (!practMode) {
      setTimeout(() => {
        this.authorize();
      }, 2000);
    } else {
      this.router.navigate(['/api-view']);
    }
  }

  async authorize() {
    //retrieve details from config file
    const client_id = sessionStorage.getItem('consumerKey');
    const redirect_uri = sessionStorage.getItem('redirectUri');
    const aud = sessionStorage.getItem('baseUrl');
    const state = uuid.v4();
    const patient = sessionStorage.getItem('patient');

    //store state to validate upon return to redirect uri
    sessionStorage.setItem('state', state);

    //retrieve the authorize endpoint from session
    let authorization_endpoint = sessionStorage.getItem('authorize_endpoint');

    //redirect to authorize endpoint
    window.location.href =
      authorization_endpoint +
      '?response_type=code&client_id=' +
      client_id +
      '&redirect_uri=' +
      redirect_uri +
      '&scope=openid%20fhirUser%20launch/patient&state=' +
      state +
      '&aud=' +
      aud +
      '&username=' +
      patient +
      '&password=' +
      patient +
      '&prompt=login';
  }

  ngOnInit(): void {
    sessionStorage.clear();
    if (this.disableField === true) {
      this.onSubmit();
    }
  }

  async getEndpoints(url: any) {
    //request to get conformance statement (including authorize and token endpoints)
    const responseObj: any = {
      authorization_endpoint: '',
      token_endpoint: '',
    };
    let response = await this.http.get<typeof responseObj>(url).toPromise();

    sessionStorage.setItem(
      'authorize_endpoint',
      response.authorization_endpoint
    );
    sessionStorage.setItem('token_endpoint', response.token_endpoint);
    // subscribe((data: any) => {
    //   const responseObj: any = {
    //     authorize_endpoint: data.authorization_endpoint,
    //     token_endpoint: data.token_endpoint,
    //   };

    //   sessionStorage.setItem(
    //     'authorize_endpoint',
    //     responseObj.authorize_endpoint
    //   );
    //   sessionStorage.setItem('token_endpoint', responseObj.token_endpoint);
    // });
    // this.getBaseUrl();
  }

  // getBaseUrl() {
  //   //get the base url from the metadata endpoint
  //   const metadata = config.metadataEndpoint
  //   this.http.get(metadata).subscribe((data: any) => {
  //     const baseUrl = data.implementation.url;
  //     sessionStorage.setItem('base_url', baseUrl);
  //   });
  // }
}
