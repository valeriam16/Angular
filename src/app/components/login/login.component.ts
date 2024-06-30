import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/interfaces/loginRequest';
import { ApiService } from 'src/app/services/api.service';
import { timeMessage, successDialog } from 'src/app/functions/alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  loginForm: FormGroup = this.fb.group({
    login_identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void { }

  get login_identifier() { return this.loginForm.get('login_identifier'); }
  get password() { return this.loginForm.get('password'); }

  login() {
    if (this.loginForm.valid) {
      const user: LoginRequest = this.loginForm.value;

      this.apiService.login(user).subscribe({
        next: (data) => {
          if (data.token) {
            this.apiService.setToken(data.token);
            timeMessage('Iniciando sesión...', 1500).then(() => {
              successDialog('Inicio de sesión completado.');
            });
              this.router.navigateByUrl('/dashboard');
              this.loginForm.reset();
          } else {
            this.errorMessage = 'No se ha recibido un token válido.';
          }
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Credenciales incorrectas.';
            this.loginForm.reset();
          } else if (error.status === 401) {
            this.errorMessage = 'Acceso no autorizado.';
          } else {
            this.errorMessage = 'Ha ocurrido un error. Intente nuevamente.';
          }
          console.error('Error al iniciar sesión:', error);
        }
      });
    }
  }
}
