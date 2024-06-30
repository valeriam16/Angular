import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiService } from './services/api.service';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { GetAddressComponent } from './components/get-address/get-address.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAddressesComponent } from './components/user-addresses/user-addresses.component';

import { ReactiveFormsModule } from '@angular/forms'; //Para los forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    NavbarComponent,
    AddAddressComponent,
    GetAddressComponent,
    UserAddressesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    RecaptchaV3Module,
    GoogleMapsModule,
    
  ],
  providers: [ ApiService, CookieService, 
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LejC-gpAAAAAPVuDnsxH04aywYl6EbaohIc0lZT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
