import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { Address } from 'src/app/interfaces/addressRequest';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  //userAddress: Address[] = [];
  error: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadUser();
    //this.loadUserAddress();
  }

  getUser(): void {
    this.apiService.getUser().subscribe({
      next: (userData: User) => {
        this.user = userData;
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Acceso no autorizado. Por favor, verifica tu token o inicia sesión nuevamente.';
          // Puedes redirigir al usuario a la página de login si es necesario
          //this.apiService.logout();
          //this.router.navigate(['/login']);
        } else {
          this.error = err.error.message || 'Error al cargar la información del usuario';
        }
        console.error('Error fetching user data', err);
      }
    });
  }

  private loadUser(): void {
    this.apiService.getUser().subscribe({
      next: (userData: User) => {
        this.user = userData;
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Acceso no autorizado. Por favor, verifica tu token o inicia sesión nuevamente.';
          // Puedes redirigir al usuario a la página de login si es necesario
          //this.apiService.logout();
          //this.router.navigate(['/login']);
        } else {
          this.error = err.error.message || 'Error al cargar la información del usuario';
        }
        console.error('Error fetching user data', err);
      }
    });
  }

  /* loadUserAddress(): void {
    this.apiService.getUserAddress().subscribe({
      next: (addressData: any) => {
        this.userAddress = addressData.Addresses[0] || null;
        console.log("UserAddress", this.userAddress)
      },
      error: (err) => {
        this.error = err.error.message || 'Error al cargar la dirección del usuario';
        console.error('Error fetching user address', err);
      }
    });
  } */

  /* private loadUserAddress(): void {
    this.apiService.getUserAddress().subscribe({
      next: (response: any) => {
        if (response.Addresses && response.Addresses.length > 0) {
          this.userAddress = response.Addresses;
        } else {
          this.userAddress = [];
        }
      },
      error: (err) => {
        this.error = err.error.message || 'Error al cargar la dirección del usuario';
        console.error('Error fetching user address', err);
      }
    });
  } */

}
