import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../interfaces/registerRequest';
import { LoginRequest } from '../interfaces/loginRequest';
import { User } from '../interfaces/user';
import { tap } from 'rxjs';
import { Address } from '../interfaces/addressRequest';
import { UserWithAddresses } from '../interfaces/userWithAddressesRequest';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRegister = 'http://localhost:3333/register';
  private apiLogin = 'http://localhost:3333/login';
  private apiUser = 'http://localhost:3333/user';
  private apiAddAddress = 'http://localhost:3333/addAddress';
  private apiGetAddress = 'http://localhost:3333/getAddress';
  private apiGetUsersWithAddresses = 'http://localhost:3333/addresses';
  private apiLogout = 'http://localhost:3333/logout';

  // BehaviorSubject para manejar el estado de autenticación
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router
  ) { }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post<any>(this.apiRegister, user);
  }

  login(user: LoginRequest): Observable<any> {
    return this.http.post<any>(this.apiLogin, user, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.isLoggedInSubject.next(true); // Notificar el cambio de estado
        })
      );
  }

  setToken(token: string) {
    //this.cookies.set("token", JSON.stringify(token));
    this.cookies.set("token", JSON.stringify(token), undefined, '/'); // Asegúrate de especificar la ruta
  }

  getToken() {
    const token = this.cookies.get("token");
    return token ? JSON.parse(token).token : null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUser(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(this.apiUser, { headers: headers });
  }

  addAddress(address: Address): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiAddAddress, address, { headers: headers });
  }

  getUserAddress(): Observable<Address> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Address>(this.apiGetAddress, { headers: headers });
  }

  getUsersWithAddresses(): Observable<UserWithAddresses[]> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserWithAddresses[]>(this.apiGetUsersWithAddresses, { headers: headers });
  }

  logout() {
    this.cookies.deleteAll();
    //this.cookies.delete("token");
    this.isLoggedInSubject.next(false); // Notificar el cambio de estado
    this.router.navigateByUrl("/login");
  }

  getUserRole(): Observable<number> {
    const token = this.getToken();
    if (!token) {
      return of(-1);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(this.apiUser, { headers: headers })
      .pipe(
        map(user => user.role_id),
        catchError(() => of(-1))
      );
  }


}
