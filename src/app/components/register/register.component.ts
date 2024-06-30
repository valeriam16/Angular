import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RegisterRequest } from '../../interfaces/registerRequest';
import { timeMessage, successDialog } from 'src/app/functions/alerts';
import { ReCaptchaV3Service } from 'ng-recaptcha';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private script: HTMLScriptElement;

  miFormulario: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    age: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    nickname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    password_confirmation: new FormControl('', Validators.required),
    recaptchaToken: ['']
  }, { validators: this.passwordMatchValidator });

  siteKey: string = '6LejC-gpAAAAAPVuDnsxH04aywYl6EbaohIc0lZT';
  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService, private recaptchaV3Service: ReCaptchaV3Service) {
    this.script = document.createElement('script');
  }

  ngOnInit() {
    this.loadRecaptchaScript();
  }

  ngOnDestroy() {
    this.removeRecaptchaScript();
  }

  private loadRecaptchaScript() {
    this.script = document.createElement('script');
    this.script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    document.body.appendChild(this.script);
    console.log("Script al cargar: ", this.script)
  }

  private removeRecaptchaScript() {
    if (this.script) {
      document.body.removeChild(this.script);
    }
    // Eliminar el badge de reCAPTCHA
    const badge = document.querySelector('.grecaptcha-badge');
    if (badge && badge.parentElement) {
      badge.parentElement.removeChild(badge);
    }
  }

  get name() { return this.miFormulario.get('name'); }
  get lastname() { return this.miFormulario.get('lastname'); }
  get age() { return this.miFormulario.get('age'); }
  get birthdate() { return this.miFormulario.get('birthdate'); }
  get email() { return this.miFormulario.get('email'); }
  get phone() { return this.miFormulario.get('phone'); }
  get nickname() { return this.miFormulario.get('nickname'); }
  get password() { return this.miFormulario.get('password'); }
  get confirmPassword() { return this.miFormulario.get('confirmPassword'); }
  get recaptchaToken() { return this.miFormulario.get('recaptchaToken'); }

  /* register() {
    //console.log(this.miFormulario.value)
    this.router.navigateByUrl('/login');
    this.miFormulario.reset();
  } */

  register2() {
    if (this.miFormulario.valid) {
      const user: RegisterRequest = this.miFormulario.value;
      this.apiService.register(user).subscribe({
        next: (response) => {
          timeMessage('Registrando...', 1500).then(() => {
            successDialog('Registro completado.')
          });
          console.log('Registro exitoso', response);
          this.router.navigateByUrl('/login');
          this.miFormulario.reset();
        },
        error: (error) => {
          console.error('Error en el registro', error);
        }
      });
    }
  }

  register() {
    if (this.miFormulario.valid) {
      this.recaptchaV3Service.execute('register')
        .subscribe((token: string) => {
          const user: RegisterRequest = {
            ...this.miFormulario.value,
            recaptchaToken: token
          };
          this.apiService.register(user).subscribe({
            next: (response) => {
              timeMessage('Registrando...', 1500).then(() => {
                successDialog('Registro completado.')
                console.log("Todo ha salido bien con el recaptcha: ", this.recaptchaV3Service)
                console.log("Token de recaptcha: ", this.recaptchaToken)
              });
              console.log('Registro exitoso', response);
              this.router.navigateByUrl('/login');
              this.miFormulario.reset();
            },
            error: (error) => {
              console.error('Error en el registro', error);
              console.log("Algo salió mal con el recaptcha: ", this.recaptchaV3Service)
              console.log("Token de recaptcha: ", this.recaptchaToken)
            }
          });
        });
    }
  }

  getErrorMessage(fieldName: string) {
    const fieldErrors = this.miFormulario.get(fieldName)?.errors;
    if (fieldErrors) {
      if (fieldErrors['required']) {
        return 'El campo ' + fieldName + ' es requerido.';
      } else if (fieldErrors['maxlength']) {
        return 'El campo es mayor de ' + fieldErrors['maxlength'].requiredLength + ' letras.';
      } else if (fieldErrors['minlength']) {
        return 'El campo es menor de ' + fieldErrors['minlength'].requiredLength + ' letras.';
      } else if (fieldErrors['email']) {
        return 'El email debe tener un formato válido.'
      }
    }
    return '';
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const password_confirmation = group.get('password_confirmation')?.value;

    if (password !== password_confirmation) {
      return { notSame: true };
    }

    return null;
  }
}
