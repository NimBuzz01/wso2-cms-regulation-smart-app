import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Eob } from '../model/eob.model';
import { Claim } from '../model/claim.model';
import { Organization } from '../model/organization.model';
import { Patient } from '../model/patient.model';
import { Observable } from 'rxjs';
import { Coverage } from '../model/coverage.model';

@Injectable()
export class InsuranceService {
  requestData: Object[] = [];
  private baseUrl = sessionStorage.getItem('baseUrl');

  constructor(private http: HttpClient) {}
  // getEOB(): Observable<Eob[]> {
  //   const api = this.baseUrl+'/ExplanationOfBenefit';
  //   const accessToken = sessionStorage.getItem('access_token');
  //   let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + accessToken });
  //   this.requestData.push(api);
  //   sessionStorage.setItem('request', JSON.stringify(this.requestData));
  //   return this.http.get<Eob[]>(api, {headers:headers});
  // }

  getEobID(id: any): Observable<Eob[]> {
    this.cleanup();
    const api = this.baseUrl + '/ExplanationOfBenefit/' + id;
    
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Eob[]>(api);
  }

  getEobByPatientId(id: any): Observable<Eob[]> { 
    return this.getEobByPatientIdWithParams(id,'');
  }

  getEobByPatientIdWithParams(id: any, params: string): Observable<Eob[]> { 
    this.cleanup();
    const api = params != '' ? this.baseUrl + '/ExplanationOfBenefit/?patient=' + id + '&' + params : 
    this.baseUrl + '/ExplanationOfBenefit/?patient=' + id ;
    
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Eob[]>(api);
  }

  getClaim(reference: string): Observable<Claim[]> {
    this.cleanup();
    const api = this.baseUrl+'/Claim/' + reference;
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Claim[]>(api);
  }

  getOrganization(reference: string): Observable<Organization[]> {
    this.cleanup();
    const api = this.baseUrl+'/Organization/' + reference;
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Organization[]>(api);
  }

  getCoverage(reference: string): Observable<Coverage[]> {
    this.cleanup();
    const api = this.baseUrl+'/Coverage/' + reference;
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Coverage[]>(api);
  }
  
  getPatient(reference: any): Observable<Patient[]> {
    this.cleanup();
    const api = this.baseUrl+'/Patient/' + reference;
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Patient[]>(api);
  }

  getPatientsQuery(params: any): Observable<Patient[]> {
    this.cleanup();
    const api = this.baseUrl+'/Patient/?' + params;
    this.requestData.push(api);
    sessionStorage.setItem('request', JSON.stringify(this.requestData));
    return this.http.get<Patient[]>(api);
  }

  cleanup() {
    this.requestData = [];
  }
  
}
