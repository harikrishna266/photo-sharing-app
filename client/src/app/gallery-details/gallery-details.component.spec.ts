import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryDetailsComponent } from './gallery-details.component';
import { ApiService } from '../api.service';
import { of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('GalleryDetailsComponent', () => {
  let component: GalleryDetailsComponent;
  let fixture: ComponentFixture<GalleryDetailsComponent>;
  let apiServiceSpy: jest.Mocked<ApiService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    const apiServiceSpyObj = {
      getAllImages: jest.fn(),
      deleteImage: jest.fn(),
    } as unknown as jest.Mocked<ApiService>;

    const routerSpyObj = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      declarations: [GalleryDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }) } },
        { provide: ApiService, useValue: apiServiceSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryDetailsComponent);
    component = fixture.componentInstance;

    apiServiceSpy = TestBed.inject(ApiService) as jest.Mocked<ApiService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

    apiServiceSpy.getAllImages.mockReturnValue(of([]));
    apiServiceSpy.deleteImage.mockReturnValue(of({}));
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch gallery details on init', () => {
    component.ngOnInit();
    expect(apiServiceSpy.getAllImages).toHaveBeenCalled();
  });

  test('should delete image and fetch updated details', () => {
    const imageId = '123';
    component.deleteImage(imageId);
    expect(apiServiceSpy.deleteImage).toHaveBeenCalledWith(imageId);
    expect(apiServiceSpy.getAllImages).toHaveBeenCalled();
  });

  test('should select a search result', () => {
    const mockResult = { imageTitle: 'Mock Image Title' };
    component.searchControl = new FormControl();
    component.searchImages = jest.fn();
    component.isSearchListVisible = true;
    component.selectSearchResult(mockResult);

    expect(component.searchQuery).toBe(mockResult.imageTitle);
    expect(component.searchImages).toHaveBeenCalled();
    expect(component.isSearchListVisible).toBe(false);
  });

  test('should fetch all images', () => {
    const mockGalleryAll = [{ _id: '1', imageUrl: 'url1', imageTitle: 'Title1', imageDesc: 'Desc1' }];

    apiServiceSpy.getAllImages.mockReturnValue(of(mockGalleryAll));

    component.getAllDetails();

    expect(apiServiceSpy.getAllImages).toHaveBeenCalled();
    expect(component.galleryAll).toEqual(mockGalleryAll);
    expect(component.isLoadingResults).toBe(false);
  });

  test('should handle error while fetching images', () => {
    const mockError = new Error('Test error');

    apiServiceSpy.getAllImages.mockReturnValue(throwError(mockError));

    component.getAllDetails();

    expect(apiServiceSpy.getAllImages).toHaveBeenCalled();
    expect(component.galleryAll).toEqual([]);
    expect(component.isLoadingResults).toBe(false);
  });

  test('should toggle search list visibility', () => {
    expect(component.isSearchListVisible).toBe(false);
    component.toggleSearchList();
    expect(component.isSearchListVisible).toBe(true);
    component.toggleSearchList();

    expect(component.isSearchListVisible).toBe(false);
  });

  test('should remove token from localStorage on logout', () => {
    expect(localStorage.getItem('token')).toBe(null);
    component.logoutFunction();
    expect(localStorage.getItem('token')).toBe(null);
  });
});
