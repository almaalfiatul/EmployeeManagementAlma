// aoa/date-validator.directive.ts
import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import moment from 'moment';

@Directive({
  selector: '[appDateValidator]',
  standalone: true, 
  providers: [
       { provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true }
  ]
})
export class DateValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; 

    const inputDate = moment(control.value);
    const today = moment().startOf('day');

    if (inputDate.isAfter(today)) {
      return { dateNotValid: true };
    }

    return null;
  }
}
