import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './Auth/AuthGuard';

const routes: Routes = [{
  path: 'gallery',
  component: GalleryComponent,
  data: { title: 'List of Sales' },
  canActivate: [AuthGuard]
},
{
  path: 'gallery/all',
  component: GalleryDetailsComponent,
  data: { title: 'All Gallery Details' },
  canActivate: [AuthGuard]
},
{
  path: 'search',
  component: GalleryDetailsComponent,
  canActivate: [AuthGuard]
},
{
  path: 'gallery/:imageId',
  component: GalleryDetailsComponent,
  data: { title: 'Delete' },
  canActivate: [AuthGuard]
},
{
  path: 'users/login',
  component: LoginComponent
},
{
  path: 'users/register',
  component: RegisterComponent
},
{
  path: 'users/check-availability',
  component: RegisterComponent
},
{
  path: 'users/check-user-exists',
  component: LoginComponent
},
{
  path: '',
  redirectTo: 'users/login',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
