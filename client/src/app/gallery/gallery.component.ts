import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  galleryForm!: FormGroup;
  imageFile: File | null = null;
  imageTitle = '';
  imageDesc = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  galleryAll: any;
  isFileOver = false;
  file: any;
  isFileInputOpen = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.galleryForm = this.formBuilder.group({
      imageFile: [null, Validators.required],
      imageTitle: ['', Validators.required],
      imageDesc: ['', Validators.required]
    });

  }

  triggerFileInput(event: Event) {
    event.stopPropagation();
    if (!this.isFileInputOpen) {
      this.isFileInputOpen = true;
      const fileInput = document.querySelector('.file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    this.isFileInputOpen = false;
  }

  handleDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isFileInputOpen = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  handleDragEnter(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onFormSubmit(): void {
    this.isLoadingResults = true;
    this.api.addGallery(this.galleryForm?.value, this.file)
      .subscribe((res: any) => {
        this.isLoadingResults = false;
        if (res.body) {
          this.router.navigate(['gallery/all']);
        }
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  isFormEmpty(): boolean {
    const imageTitle = this.galleryForm.get('imageTitle')?.value;
    const imageDesc = this.galleryForm.get('imageDesc')?.value;

    return !imageTitle || !imageDesc;
  }
}
