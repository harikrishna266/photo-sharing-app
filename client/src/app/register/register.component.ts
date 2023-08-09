import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      // Check if user is already registered with the provided username or email
      this.apiService.checkUserAvailability(username, email).subscribe(
        (response: any) => {
          if (response.available) {
            this.apiService.register(username, email, password).subscribe(
              (response: any) => {
                this.showAlertMessage('User registered successfully!', 'success');
                setTimeout(() => {
                  this.router.navigate(['users/login']); // Navigate to login page
                }, 1000);
              },
              (error) => {
                this.showAlertMessage('Problem during registration. Please try again.', 'danger');
                console.error(error);
              }
            );
          } else {
            this.showAlertMessage('Username or email already exists. Please choose another or Try to login.', 'danger');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
