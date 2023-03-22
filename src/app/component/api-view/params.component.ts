import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SearchParam } from '../../model/search-param.model';

@Component({
  selector: 'search-param',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.css'],
})
export class ParamComponent {
  @Input() param!: SearchParam;
  @Input() form!: UntypedFormGroup;
  get isValid() { return this.form.controls[this.param.key].valid; }
}
