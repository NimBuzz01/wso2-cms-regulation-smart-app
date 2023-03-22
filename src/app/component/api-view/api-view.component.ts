import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceService } from '../../service/insurance.service';
import { AppConfigService } from '../../service/configuration-service';
import { Eob } from '../../model/eob.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import config from '../../../assets/config/config.json';
import jwt_decode from 'jwt-decode';
import { Claim } from '../../model/claim.model';
import { Operation } from '../../model/operation.model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SearchParamsControlService } from '../../service/search-control.service';
import { SearchParam } from '../../model/search-param.model';
import { Subscription, Observable, timer } from 'rxjs';

@Component({
  selector: 'app-api-view',
  templateUrl: './api-view.component.html',
  styleUrls: ['./api-view.component.css'],
  providers: [InsuranceService, AppConfigService, SearchParamsControlService],
})
export class APIViewComponent implements OnInit {
  profileForm!: UntypedFormGroup;
  operations: Operation[] = [];
  params: SearchParam[] = [];
  SelectedOperationId:any = -1;
  jsondata = {};
  patientId = sessionStorage.getItem('patientId');
  elementData: Object[] = [];
  responseData: Object[] = [];
  requestData: Object[] = [];
  dataSource = new MatTableDataSource(this.elementData);
  displayedColumns = [
    'id',
    'type',
    'created',
    'enterer',
    'status',
    'total',
  ];
  selection = new SelectionModel<Eob>(true, []);
  everySecond!: Observable<number>;

  //retrieve details from config file
  client_id = sessionStorage.getItem('consumerKey');
  client_secret = sessionStorage.getItem('consumerSecret');
  redirect_uri = sessionStorage.getItem('redirectUri');
  aud = sessionStorage.getItem('baseUrl');
  practitionerMode: boolean = (sessionStorage.getItem('practitionerMode') == 'true');
  claim = new Claim();
  eob = new Eob();

  data: any;
  constructor(
    private router: Router,
    private applicationRef: ApplicationRef,
    private ngZone: NgZone,
    private insuranceService: InsuranceService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private spcs: SearchParamsControlService,
  ) { 
     let pps = [new SearchParam('_id'), new SearchParam('given'), new SearchParam('family'), new SearchParam('address-state'), new SearchParam('address-city')];
     let fpi = new Operation('0', 'Patient Information', pps);
     let peobs = [new SearchParam('_id'), new SearchParam('_profile'), new SearchParam('_lastUpdated'), new SearchParam('identifier'), new SearchParam('type'), new SearchParam('service-date')];
     let feobs = new Operation('1', 'Explanation of Benefits', peobs);
     let idp = new SearchParam('id');
     idp.required = true;
     let covs = new Operation('2', 'Coverage', [idp]);
     this.operations = [fpi, feobs];
  }


  ngOnInit() {
    // console.log(this.claim);
    let access_token: any = sessionStorage.getItem('access_token');
    if (access_token === null) {
      this.getToken();
    }
    // this.refreshToken();
    this.profileForm = this.fb.group({patientId: []});
    let expirytime = sessionStorage.getItem('expires_in');
    this.everySecond= timer(60000, expirytime == null ? 2700000 : Number(expirytime)*1000);
    this.everySecond.subscribe((seconds) => {
        this.refreshToken();
    });
  }

  onChange(){
    //here is where we can call out to other services to use the value selected
    let selectedOp = this.operations[this.SelectedOperationId] ; 
    this.params = selectedOp.getParams();
    this.profileForm = this.spcs.toFormGroup(this.params, this.profileForm);
  }

  onSubmit() {
    // this.refreshToken(1);
    // const wellknownEndpoint = config.wellknownEndpoint;
    // if (this.profileForm.invalid === true) {
    //   console.log('Empty');
    //   return;
    // } else {
    //   const data: any = {};
    //   if (this.profileForm.value.configUrl == null) {
    //     data.configUrl = wellknownEndpoint;
    //     console.log(data.configUrl);
    //   } else {
    //     data.configUrl = this.profileForm.value.configUrl +"/.well-known/smart-configuration";
    //   }
      // const baseUrl = this.profileForm.value.baseUrl;
      // const consumerKey = this.profileForm.value.consumerKey;
      // const consumerSecret = this.profileForm.value.consumerSecret;
      // let redirectUri = 'http://localhost:3000/api-view';
      // if (this.profileForm.value.redirectUri != null) {
      //   redirectUri = this.profileForm.value.redirectUri;
      // }

      // sessionStorage.setItem('baseUrl', baseUrl);
      // sessionStorage.setItem('consumerKey', consumerKey);
      // sessionStorage.setItem('consumerSecret', consumerSecret);
      // sessionStorage.setItem('redirectUri', redirectUri);

      if (this.practitionerMode) {
        let patientId = this.profileForm.value.patientId;
        sessionStorage.setItem('patientId', patientId);
      }
      this.jsondata = {};
      switch (this.SelectedOperationId) {
        case '0':
          this.fetchProfile();
          break;
        case '1': 
            this.fetchEobsWithParams(); 
            break;
        case '2':
            this.fetchCoverage();
            break;
      }
  }

  buildQueryParamString() {
    let qparam = '';
    this.params.forEach(param => {
      
      let value = this.profileForm.get(param.key);
      if (value != null && value.value != '') {
        qparam += param.key + '=' + value.value + '&';
      }
    });
    return qparam != '' ? qparam.substring(0, qparam.length-1) : '';
  }

  getParamValue(param: any) {
    let value = this.profileForm.get(param);
    if (value != null && value.value != '') {
      return value.value;
    }
    return '';
  }


  async fetchEobsWithParams() {
    this.cleanup();
    let patientId = sessionStorage.getItem('patientId');
    const eobDetails: any = await this.insuranceService
      .getEobByPatientIdWithParams(patientId, this.buildQueryParamString())
      .toPromise();

    this.responseData.push(eobDetails);
    sessionStorage.setItem('response', JSON.stringify(this.responseData));
    this.jsondata = eobDetails;
  }

  async fetchCoverage() {
    this.cleanup();
    let id = this.getParamValue(this.params[0].key);
    const covDetails: any = await this.insuranceService
      .getCoverage(id)
      .toPromise();

    this.responseData.push(covDetails);
    sessionStorage.setItem('response', JSON.stringify(this.responseData));
    this.jsondata = covDetails == null ? {"Error": ""} : covDetails;
  }


  /* Fetch EOBs of the patient */
  async fetchEobs() {
    this.cleanup();
    let patientId = sessionStorage.getItem('patientId');
    const eobDetails: any = await this.insuranceService
      .getEobByPatientId(patientId)
      .toPromise();

    this.responseData.push(eobDetails);
    sessionStorage.setItem('response', JSON.stringify(this.responseData));
    this.jsondata = eobDetails;
  }

  async fetchProfile(){
    this.cleanup();
    let patientId = sessionStorage.getItem('patientId');
    let paramstr = this.buildQueryParamString();
    var patientDetails: any = {};
    if (paramstr == '') {
      patientDetails = await this.insuranceService
      .getPatient(patientId)
      .toPromise();
    } else {
      patientDetails = await this.insuranceService
      .getPatientsQuery(paramstr)
      .toPromise();
    }

    this.responseData.push(patientDetails);
    sessionStorage.setItem('response', JSON.stringify(this.responseData));
    this.jsondata = patientDetails;
  }

  cleanup(){
    this.responseData = [];
  }

  /* Method to get access token */
  getToken() {
    let code;
    let resState;
    let sessionState;

    //retrieve code and state from the url
    this.activatedRoute.queryParams.subscribe((params) => {
      code = params['code'];
      sessionStorage.setItem('authorization_code', code);
      sessionStorage.setItem('code', code);
      resState = params['state'];
      sessionState = params['session_state'];
      sessionStorage.setItem('session_state', sessionState);
    });

    //validate the value of the state parameter upon return to the redirect URL
    let reqState = sessionStorage.getItem('state');
    if (reqState == resState || this.practitionerMode) {
      //retrieve the token endpoint from session
      let url: any = sessionStorage.getItem('token_endpoint');

      //set body
      let body =
        'grant_type=authorization_code&code=' +
        code +
        '&redirect_uri=' +
        this.redirect_uri;

      if (this.practitionerMode) {
        body = 'grant_type=client_credentials&scope=patient-view';
      }

      //post request to token endpoint
      this.http.post(url, body).subscribe(
        (data: any) => {
          sessionStorage.setItem('access_token', data.access_token);
          sessionStorage.setItem('refresh_token', data.refresh_token);
          sessionStorage.setItem('id_token', data.id_token);
          sessionStorage.setItem('token_type', data.token_type);
          sessionStorage.setItem('expires_in', data.expires_in);
          sessionStorage.setItem('scope', data.scope);
          this.router.navigate(['/api-view']);
          this.setPatientId();
        },

        //error message
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client side error');
          } else {
            console.log('Server side error');
          }
        }
      );
    }
  }

  /* Method to refresh token */
  refreshToken(counter: any = sessionStorage.getItem('expires_in')) {
    //retrieve refresh token from session
    let refresh_token = sessionStorage.getItem('refresh_token');

    //retrieve the token endpoint from session
    let url: any = sessionStorage.getItem('token_endpoint');

    //set body
    let body =
      'grant_type=refresh_token&refresh_token=' +
      refresh_token ;
      // '&scope=apim:api_publish+openid+fhirUser';

    this.http.post(url, body).subscribe((data: any) => {
      sessionStorage.setItem('access_token', data.access_token);
      sessionStorage.setItem('refresh_token', data.refresh_token);
      sessionStorage.setItem('token_type', data.token_type);
      sessionStorage.setItem('expires_in', data.expires_in);
      sessionStorage.setItem('scope', data.scope);
      // this.router.navigate(['/api-view']);
      // this.setPatientId();
    },

    //error message
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client side error');
      } else {
        console.log('Server side error');
      }
    }
  );
    // let intervalId = setInterval(() => {
    //   counter = counter - 1;
    //   if (counter === 0) {
    //     clearInterval(intervalId);
    //     this.snackBar.open('Session expired', '', { duration: 5000 });
    //     //post request to token endpoint
    //     this.http.post(url, body).subscribe();
    //   }
    // }, 1000);
  }

  setPatientId() {
    let id_token: any = sessionStorage.getItem('id_token');
    if (id_token != null) {
      let decodedIdToken: any = jwt_decode(id_token);
      this.patientId = decodedIdToken.patientId;
      sessionStorage.setItem('patientId', decodedIdToken.patientId);
    }
  }

  /* Method to get clinical data */
  async getDetails() {
    let id_token: any = sessionStorage.getItem('id_token');
    let decodedIdToken: any = jwt_decode(id_token);
    let patientId = decodedIdToken.patientId;
    sessionStorage.setItem('patientId', patientId);
    const eobDetails: any = await this.insuranceService
      .getEobByPatientId(patientId)
      .toPromise();

    this.responseData.push(eobDetails);

    for (let element of eobDetails.entry) {
      const patientidInElt = element.resource.patient.reference.replace(/ /g,"");
      if (patientidInElt === 'Patient/' + patientId) {
        // var claimDetails: any = await this.insuranceService
        //   .getClaim(element.resource.claim.reference.split('/').pop())
        //   .toPromise()
        //   .then((response) => {
        //     console.log('response taken');
        //   })
        //   .catch((err) => {
        //     console.log("An error has occurred: " + err.statusText);
        //   });
        // if (!claimDetails) {
        //   claimDetails = this.claim
        // }
  
        // this.responseData.push(claimDetails);
  
        const data = {
          id: element.resource.id.replace(/ /g,""),
          type: element.resource.type.coding[0].display.replace(/ /g,""),
          claimId: element.resource.id.replace(/ /g,""),
          created: element.resource.created.split('T')[0],
          enterer: element.resource.provider.reference.replace(/ /g,""),
          status: element.resource.status,
          //prescription: element.resource.prescription.reference,
          total: element.resource.total[0].amount.value,
        };
        this.elementData.push(data);
        // console.log(data);
      }
    }

    //sort the table according to the claim id
    this.elementData.sort((a: any, b: any) => {
      return b.created - a.created;
    });
    this.dataSource = new MatTableDataSource(this.elementData);
    sessionStorage.setItem('response', JSON.stringify(this.responseData));
  }



  // openClaim(id: any) {
  //   JSON.stringify(sessionStorage.setItem('id', id));
  //   this.router.navigate(['/claim-details']);
  // }

  //Refresh button functionality
  reload() {
    window.location.reload();
  }
}
