import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Gallery } from './gallery';

const apiUrl = 'http://localhost:3000/gallery';
const apiUserUrl = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: any;
  apiUserUrl: any;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAllImages(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store'
      })
    };
    const url = `${apiUrl}/all`;
    return this.http.get<Gallery>(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addGallery(gallery: Gallery, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageTitle', gallery.imageTitle);
    formData.append('imageDesc', gallery.imageDesc);
    const header = new HttpHeaders();
    const params = new HttpParams();
    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', apiUrl, formData, options);
    return this.http.request(req);
  }

  deleteImage(imageId: string): Observable<any> {
    const deleteUrl = `${apiUrl}/${imageId}`;
    return this.http.delete(deleteUrl);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${apiUserUrl}/login`, { username, password });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, otherwise false
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${apiUserUrl}/register`, { username, password, email });
  }

  checkUserAvailability(username: string, email: string): Observable<any> {
    const url = `${apiUserUrl}/check-availability`;
    const requestBody = { username, email };
    return this.http.post(url, requestBody);
  }

  checkUserExists(username: string): Observable<any> {
    const url = `${apiUserUrl}/check-user-exists`;
    const requestBody = { username };
    return this.http.post(url, requestBody);
  }
}