# Wso2CMSSmartOnFhirApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Prerequisites

Install following packages;

```npm install --sav-dev@angular-devkit/build-angular
npm install ngx-json-viewer
npm i -g @angular/cli```


## Development server

Run `ng serve --base-href /wso2-cms-regulation-smart-app/` for a dev server. Navigate to `http://localhost:4200/wso2-cms-regulation-smart-app/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy to lite-server

- Install lite-server (https://github.com/johnpapa/lite-server) - 
  `npm install --global lite-server`

- Run `ng build` to build the project.

- Navigate to `dist/wso2-cms-regulation-smart-app` folder.

- Run `lite-server` and this will start the lite-server on port 3000. You can access the application through `http://localhost:3000`

## Configurations

- Base FHIR URL - this is the FHIR server URL of your environment. You can find this value from the Developer Portal. Navigate to any API, expand the ‘Production and Sandbox’ section and you should see Gateway URLs of that particular API. Base FHIR URL is the ‘https’ url without the API context (eg: /r4/Patient*). eg: Base FHIR URL - `https://fhir.myhealthplan.com`

- Consumer Key - this is the consumer key of the application you registered in WSO2 Open Healthcare Developer Portal.

- Consumer Secret - this is the consumer secret of the application you registered in WSO2 Open Healthcare Developer Portal.

- Redirect URI - Default URI will be automatically taken as `http://localhost:3000/api-view`. If this application is hosted in a different domain, please enter the domain name with `/api-view` context.

PS: You should sign in to the Developer Portal as a third party application developer through the sign up page of the Developer Portal. When you register the application in WSO2 Open Healthcare Developer Portal, you have to enable ‘code’ grant type and use the `http://localhost:3000/api-view` as the ‘Callback URL’ of this application. Also, please subscribe to all available APIs through the ‘Subscriptions’ tab of the application.


