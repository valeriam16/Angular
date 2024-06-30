import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { LayoutComponent } from '../components/layout/layout.component';
import { NoAuthGuard } from '../guards/noauth.guard';
import { AddAddressComponent } from '../components/add-address/add-address.component';
import { GetAddressComponent } from '../components/get-address/get-address.component';
import { UserAddressesComponent } from '../components/user-addresses/user-addresses.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  /* {
    path: '',
    component: AppComponent,
    children: [
      //FormRegister
      { path: 'register', component: RegisterComponent, canActivate: [] },
      //FormLogin
      { path: 'login', component: LoginComponent, canActivate: [] },
      //InfoUser
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    ]
  }, */
  { path: '', component: LayoutComponent, canActivate: [NoAuthGuard] },
  //FormRegister
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  //FormLogin
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  //InfoUser
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  //Form AddAddress
  { path: 'addAddress', component: AddAddressComponent, canActivate: [AuthGuard] },
  //Addreess from User
  { path: 'getAddress', component: GetAddressComponent, canActivate: [AuthGuard] },
  //Users with Addresses
  { path: 'usersWithAddresses', component: UserAddressesComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: '**', component: NotFoundComponent, canActivate: [] }, //Cualquiero ruta que no encuentre estará aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
