import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Gallery } from './../gallery';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gallery-details',
  templateUrl: './gallery-details.component.html',
  styleUrls: ['./gallery-details.component.scss']
})
export class GalleryDetailsComponent implements OnInit {

  gallery: Gallery = { _id: '', imageUrl: '', imageTitle: '', imageDesc: '', uploaded: new Date() };
  galleryAll: any[] = [];
  isLoadingResults = true;
  isLoadingFilterResults = false;
  filteredGalleryAll: any[] = [];
  searchQuery: string | null = '';
  newData: any;
  searchResults: any[] = [];
  searchControl: FormControl = new FormControl('');
  isSearchListVisible = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllDetails();
    this.route.queryParamMap.subscribe(params => {
      this.searchQuery = params.get('q');
      this.searchImages();
    });

    if (!this.searchQuery) {
      this.getAllDetails();
      return;
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchImages();
    });
  }

  toggleSearchList(): void {
    this.isSearchListVisible = !this.isSearchListVisible;
  }

  selectSearchResult(result: any): void {
    this.searchQuery = result.imageTitle;
    this.searchControl.setValue(result.imageTitle);
    this.searchImages();
    this.isSearchListVisible = false;
  }

  getAllDetails(): void {
    this.api.getAllImages().subscribe(
      (data: any) => {
        this.galleryAll = data;
        this.isLoadingResults = false;
      },
      (error) => {
        console.error('Error fetching images:', error);
        this.isLoadingResults = false;
      }
    );
  }

  searchImages(): void {
    this.isLoadingFilterResults = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery },
      queryParamsHandling: 'merge',
    });

    this.api.getAllImages().subscribe(
      (data: any) => {
        this.newData = data;
        // Filter the data based on the searchQuery
        if (this.searchQuery) {
          this.filteredGalleryAll = this.newData.filter((image: any) => {
            return image.imageTitle.toLowerCase().includes(this.searchQuery?.toLowerCase().trim());
          });
          this.searchResults = this.filteredGalleryAll;
          if (this.searchResults.length === 1 && this.searchResults[0].imageTitle === this.searchQuery) {
            this.searchResults = [];
          }
        } else {
          this.isLoadingFilterResults = false;
        }
      },
      (error) => {
        console.error('Error fetching images:', error);
        this.isLoadingResults = false;
      }
    );
  }

  deleteImage(imageId: string): void {
    this.api.deleteImage(imageId).subscribe(
      (response) => {
        console.log('Image deleted successfully:', response);
        this.searchImages();
        this.getAllDetails();
      },
      (error) => {
        console.error('Error deleting image:', error);
      }
    );
  }

  logoutFunction(): void {
    localStorage.removeItem('token');
  }
}