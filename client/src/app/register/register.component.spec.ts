import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { ApiService } from '../api.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockApiService: Partial<ApiService>;

  beforeEach(() => {
    mockApiService = {
      checkUserAvailability: jest.fn(),
      register: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: mockApiService }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show an alert message when registration is successful', () => {
    mockApiService.checkUserAvailability = jest.fn().mockReturnValue(of({ available: true }));
    mockApiService.register = jest.fn().mockReturnValue(of({}));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password'
    });
    component.register();

    expect(component.showAlert).toBe(true);
    expect(component.alertType).toBe('success');
    expect(component.alertMessage).toBe('User registered successfully!');
  });

  test('should show an alert message when registration fails', () => {
    mockApiService.checkUserAvailability = jest.fn().mockReturnValue(of({ available: true }));
    mockApiService.register = jest.fn().mockReturnValue(throwError('Registration failed'));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password'
    });
    component.register();

    expect(component.showAlert).toBe(true);
    expect(component.alertType).toBe('danger');
    expect(component.alertMessage).toBe('Problem during registration. Please try again.');
  });

  test('should show an alert message when username or email already exists', () => {
    mockApiService.checkUserAvailability = jest.fn().mockReturnValue(of({ available: false }));

    component.registerForm.setValue({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password'
    });
    component.register();

    expect(component.showAlert).toBe(true);
    expect(component.alertType).toBe('danger');
    expect(component.alertMessage).toBe('Username or email already exists. Please choose another or Try to login.');
  });
});
