import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Gallery } from './gallery';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let httpClientSpy: { post: jest.Mock, get: jest.Mock, delete: jest.Mock, request: jest.Mock };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);

    httpClientSpy = { post: jest.fn(), get: jest.fn(), delete: jest.fn(), request: jest.fn() };
    service = new ApiService(httpClientSpy as any);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should retrieve all images', () => {
    const mockResponse: Gallery[] = [];
    httpClientSpy.get.mockReturnValue(of(mockResponse));
    let response: Gallery[] | undefined;

    service.getAllImages().subscribe((data) => {
      response = data;
    });
    expect(response).toEqual(mockResponse);
  });

  test('should delete an image', () => {
    const mockResponse = { message: 'Image deleted successfully' };
    httpClientSpy.delete.mockReturnValue(of(mockResponse));
    const imageId = '123';

    service.deleteImage(imageId).subscribe((response) => {
      expect(response).toEqual({ message: 'Image deleted successfully' });
    });
  });

  test('should add a new gallery with file', () => {
    const mockResponse = { message: 'Image added successfully' };
    httpClientSpy.request.mockReturnValue(of(mockResponse));
    const mockGallery: any = {
      imageTitle: 'Test Image',
      imageDesc: 'Test Description',
      _id: '',
      imageUrl: '',
      uploaded: '2023-08-10T00:00:00Z'
    };
    const mockFile = new File([''], 'test.png', { type: 'image/png' });

    service.addGallery(mockGallery, mockFile).subscribe((response) => {
      expect(response).toBeTruthy();
    });
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return true if token exists', () => {
    const mockToken = 'mockToken';
    localStorage.setItem('token', mockToken);
    const result = service.isLoggedIn();
    expect(result).toBe(true);
  });

  test('should return false if token does not exist', () => {
    localStorage.removeItem('token');
    const result = service.isLoggedIn();
    expect(result).toBe(false);
  });


  test('should check user availability', () => {
    const mockResponse = { isAvailable: true };
    httpClientSpy.post.mockReturnValue(of(mockResponse));

    const username = 'testUser';
    const email = 'test@example.com';

    service.checkUserAvailability(username, email).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        'http://localhost:3000/users/check-availability',
        { username, email }
      );
    });
  });

  test('should check if user exists', () => {
    const mockResponse = { exists: true };
    httpClientSpy.post.mockReturnValue(of(mockResponse));

    const username = 'testUser';

    service.checkUserExists(username).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        'http://localhost:3000/users/check-user-exists',
        { username }
      );
    });
  });

});
