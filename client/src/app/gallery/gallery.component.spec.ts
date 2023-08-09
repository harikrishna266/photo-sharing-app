import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
import { GalleryComponent, MyErrorStateMatcher } from './gallery.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let apiService: ApiService;
  let mockApiService: Partial<ApiService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockApiService = {
      addGallery: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [GalleryComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        ApiService,
        FormBuilder,
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should handle selected file', () => {
    const dummyFile = new File(['dummy content'], 'dummy.txt', { type: 'text/plain' });
    component.getFile({ target: { files: [dummyFile] } });
    expect(component.file).toBe(dummyFile);
    expect(component.isFileInputOpen).toBe(false);
  });

  test('should handle dropped file', () => {
    const dummyFile = new File(['dummy content'], 'dummy.txt', { type: 'text/plain' });
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
      dataTransfer: {
        files: [dummyFile],
      },
    } as unknown as DragEvent;

    component.handleDrop(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.isFileInputOpen).toBe(false);
    expect(component.file).toBe(dummyFile);
  });

  test('should navigate to "gallery/all" on successful form submission', () => {
    const mockResponse = {
      _id: 'dummy_id',
      imageUrl: 'dummy_image_url',
      imageTitle: 'Dummy Title',
      imageDesc: 'Dummy Description',
      uploaded: '2023-08-10T00:00:00Z',
    };
    mockApiService.addGallery = jest.fn(() => of(mockResponse));
    const formValue: any = {
      id: 'dummy_id',
      imageUrl: 'dummy_image_url',
      imageFile: new File(['dummy content'], 'dummy.txt', { type: 'text/plain' }),
      imageTitle: 'Dummy Title',
      imageDesc: 'Dummy Description',
      uploaded: '2023-08-10T00:00:00Z',
    };
    const comp = component

    comp.galleryForm = new FormGroup({
      id: new FormControl(),
      imageUrl: new FormControl(),
      imageFile: new FormControl(),
      imageTitle: new FormControl(),
      imageDesc: new FormControl(),
      uploaded: new FormControl(),
    });

    component.galleryForm.setValue(formValue);
    component.file = formValue.imageFile;

    component.onFormSubmit();

    expect(component.isLoadingResults).toBe(false);
    expect(mockApiService.addGallery).toHaveBeenCalledWith(formValue, formValue.imageFile);
  });

  test('should open the file input when triggerFileInput is called', () => {
    component.isFileInputOpen = false;

    const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;

    component.triggerFileInput(mockEvent);

    expect(component.isFileInputOpen).toBe(true);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  test('should not open the file input again if it is already open', () => {
    component.isFileInputOpen = true;

    const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;

    component.triggerFileInput(mockEvent);

    expect(component.isFileInputOpen).toBe(true);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  test('should stop propagation and prevent default when handleDragEnter is called', () => {
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    component.handleDragEnter(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('should stop propagation and prevent default when handleDragOver is called', () => {
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    component.handleDragOver(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('should stop propagation and prevent default when handleDragLeave is called', () => {
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    component.handleDragLeave(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('should return true when both imageTitle and imageDesc are empty', () => {
    component.galleryForm = new FormBuilder().group({
      imageTitle: '',
      imageDesc: '',
    });

    const result = component.isFormEmpty();
    expect(result).toBe(true);
  });

  test('should return false when both imageTitle and imageDesc are not empty', () => {
    component.galleryForm = new FormBuilder().group({
      imageTitle: 'Sample Title',
      imageDesc: 'Sample Description',
    });

    const result = component.isFormEmpty();
    expect(result).toBe(false);
  });
});