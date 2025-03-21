import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductDTO } from '../../shared/interface/product.interface';
import { ProductService } from '../../shared/services/product.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { catchError, of, tap } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { RatingPipes } from '../../shared/pipes/ratings.pipes';


@Component({
  selector: 'app-dashboard',
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    MultiSelectModule,
    SelectModule,
    RatingPipes
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class DashboardComponent implements OnInit{

  products: ProductDTO[] = [];

  loading: boolean = true;

  representatives!: string[];

  selectedRepresentatives: string[] = [];

  filterProduct: ProductDTO[] = [];

  category!: string[];

  selectedCategory: string[] = []

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.productService.getProductList().pipe(
      tap({
        next: (data) => {
          this.products = data;
          this.filterProduct = data;
          this.loading = false
          this.representatives = this.products.map(item => item.title)
          this.category = [...new Set(this.products.map(item => item.category))];
        },
        error: (err) => {
          console.error('Failed to load products:', err);
        }
      }),
      catchError((err) => {
        console.error('Error in load Product', err);
        return of([])
      })
    ).subscribe()
  }

  applyGlobalFilter(event: Event, dt2: any) {
    const inputElement = event.target as HTMLInputElement;
    if (dt2) {
      dt2.filterGlobal(inputElement.value, 'contains');
    }
  }

  addNewProduct = () => {
    this.router.navigate(['/add'])
  }

  editProduct = (id:number) => {
    this.router.navigate(['/edit', id])
  }

  deleteProduct = (id:number) => {
    this.productService.deleteProduct(id).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Product deleted' });
    })
  }

  confirm(event: Event, productId: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Delete Product',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },
        accept: () => {
          this.deleteProduct(productId);
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
  }

  filterCallback(selectedProduct: string[]) {
    if(selectedProduct.length === 0) {
      this.filterProduct = this.products;
    } else {
      this.filterProduct = this.products.filter(
        product => selectedProduct.includes(product.title) || selectedProduct.includes(product.category))
    }
  }

  filterRepresentatives(event: any): void {
    if (event.value === undefined || event.value.length === 0) {
        this.selectedRepresentatives = [];
        this.filterCallback([]);
    } else {
        this.selectedRepresentatives = event.value;
        this.filterCallback(this.selectedRepresentatives);
    }
  }

  filterCategory(event: any): void {
    this.selectedCategory = event.value;
    this.filterCallback(this.selectedCategory)
  }

}
