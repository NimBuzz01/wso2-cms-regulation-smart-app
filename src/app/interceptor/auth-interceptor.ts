import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import config from '../../assets/config/config.json';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    //retrieve details from session storage
    let access_token: any = sessionStorage.getItem('access_token');
    let authorization_code: any = sessionStorage.getItem('authorization_code')
    let id_token: any = sessionStorage.getItem('id_token');
    
    let client_id = sessionStorage.getItem('consumerKey');
    let client_secret = sessionStorage.getItem('consumerSecret');

    if (access_token) {    
      if (request.method.toLowerCase() === 'get') {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + access_token) });
        //let decodedIdToken: any = jwt_decode(id_token);
        //request = request.clone({ params: request.params.set('patient', decodedIdToken.patientID) })
      }  
    }

    if (authorization_code) {
      if (request.method.toLowerCase() === 'post') {
        request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret))});
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      }
    }
    
    return next.handle(request);
  }
}
