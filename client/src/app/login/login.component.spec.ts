import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockApiService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockApiService = {
      checkUserExists: jest.fn(),
      login: jest.fn()
    };
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize form with required fields', () => {
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  test('should call apiService.checkUserExists and apiService.login when login is called with valid form', () => {
    const mockApiResponse = { exists: true };
    mockApiService.checkUserExists.mockReturnValue(of(mockApiResponse));
    mockApiService.login.mockReturnValue(of({ token: 'mockToken' }));

    component.loginForm.setValue({ username: 'mockUser', password: 'mockPassword' });
    component.login();

    expect(mockApiService.checkUserExists).toHaveBeenCalledWith('mockUser');
    expect(mockApiService.login).toHaveBeenCalledWith('mockUser', 'mockPassword');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['gallery']);
  });

  test('should show success alert message and set token in localStorage when login is successful', () => {
    mockApiService.checkUserExists.mockReturnValue(of({ exists: true }));
    mockApiService.login.mockReturnValue(of({ token: 'mockToken' }));

    component.loginForm.setValue({ username: 'mockUser', password: 'mockPassword' });
    component.login();

    expect(component.showAlert).toBeTruthy();
    expect(component.alertMessage).toEqual('User logged in successfully!');
    expect(component.alertType).toEqual('success');
    expect(localStorage.getItem('token')).toEqual('mockToken');
  });

  test('should show danger alert message when login fails', () => {
    mockApiService.checkUserExists.mockReturnValue(of({ exists: true }));
    mockApiService.login.mockReturnValue(throwError('login error'));

    component.loginForm.setValue({ username: 'mockUser', password: 'mockPassword' });
    component.login();

    expect(component.showAlert).toBeTruthy();
    expect(component.alertMessage).toEqual('Invalid username or password. Please try again.');
    expect(component.alertType).toEqual('danger');
  });

});
