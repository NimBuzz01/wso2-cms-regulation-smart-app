import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { SearchParam } from '../model/search-param.model';

@Injectable()
export class SearchParamsControlService {
  constructor() { }

  toFormGroup(params: SearchParam[], profile: UntypedFormGroup ) {
    const group: any = profile.controls;

    params.forEach(param => {
      group[param.key] = new UntypedFormControl(param.value || '');
    });
    return new UntypedFormGroup(group);
  }
}