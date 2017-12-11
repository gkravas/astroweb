import { AbstractControl } from '@angular/forms';

export function checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (ac: AbstractControl) => {
      var passwordInput, passwordConfirmationInput;
      try {
        passwordInput = ac['_parent'].get(passwordKey);
        passwordConfirmationInput = ac['_parent'].get(passwordConfirmationKey);
      } catch(err) {
        return null;
      }

      if (passwordInput != null && passwordConfirmationInput != null &&
           passwordInput.value !== passwordConfirmationInput.value) {
        return {'mismatch': true};
      } else {
          return null;
      }
    }
  }