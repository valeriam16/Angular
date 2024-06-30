import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isSupport: boolean = false;
  private authSubscription: Subscription = new Subscription();
  //private roleSubscription: Subscription = new Subscription();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación
    this.authSubscription = this.apiService.isLoggedIn().subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          // Obtener el rol del usuario cuando esté logueado
          this.authSubscription = this.apiService.getUserRole().subscribe(
            (role_id: number) => {
              this.isAdmin = (role_id === 1);
              this.isSupport = (role_id === 2);
            }
          );
        } else {
          this.isAdmin = false;
          this.isSupport = false;
        }
      }
    );
  }

  logout() {
    this.apiService.logout();
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción cuando el componente sea destruido
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
