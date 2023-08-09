import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(): boolean {
    if (this.apiService.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['users/login']); // Redirect to login page if not logged in
      return false;
    }
  }
}
