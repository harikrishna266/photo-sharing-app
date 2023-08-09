import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Check if user exists before attempting to login
      this.apiService.checkUserExists(username).subscribe(
        (response: any) => {
          if (response.exists) {
            this.apiService.login(username, password).subscribe(
              (response: any) => {
                localStorage.setItem('token', response.token);
                this.showAlertMessage('User logged in successfully!', 'success');
                this.router.navigate(['gallery']);
              },
              (error) => {
                console.error(error);
                this.showAlertMessage('Invalid username or password. Please try again.', 'danger');
              }
            );
          } else {
            this.showAlertMessage('User not registered. Redirecting to registration page...', 'danger');
            setTimeout(() => {
              this.router.navigate(['users/register']); // Redirect to register page
            }, 1000);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private showAlertMessage(message: string, type: string) {
    console.log('Showing alert:', message, type);
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
