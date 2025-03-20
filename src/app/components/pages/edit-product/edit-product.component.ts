import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDTO } from '../../../shared/interface/product.interface';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-edit-product',
  imports: [
    FormsModule, 
    InputGroupModule, 
    InputGroupAddonModule, 
    InputTextModule, 
    SelectModule, 
    InputNumberModule,
    ReactiveFormsModule,
    IftaLabelModule,
    DividerModule,
    ButtonModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [MessageService]
})
export class EditProductComponent implements OnInit{

  public form!: FormGroup
  public category!: string[];
  productId!: number;
  product!: ProductDTO;
  isEditMode: boolean = false;
  private destroy$ = new Subject<void>

  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService, 
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      image: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
    })
  }

  ngOnInit(): void {
    this.productService.getAllCategories().subscribe(data => {
      this.category = data
    })

    this.route.params.subscribe(parmas => {
      this.productId = +parmas['id'];
      if(this.productId) {
        this.isEditMode = true
        this.loadProduct();
      }
    })
  }

  loadProduct(): void {
    this.productService.getProductList().pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.product = data.find((item) => item.id === this.productId) as ProductDTO;
      if(this.product) {
        this.form.patchValue(this.product)
      }
    });
  }

  onSubmit(): void {
    if(this.form.invalid) {
      return
    }

    const productData = this.form.value;

    if(this.isEditMode) {
        this.productService.updateProduct(this.productId, this.product).pipe(
          tap(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully' });
          }),
          catchError((err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
            return of(null); 
          }),
          takeUntil(this.destroy$)
        ).subscribe(() => {
          this.router.navigate(['/dashboard'])
        })
    } else {
      this.productService.addProduct(productData).pipe(
        tap(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Added successfully' });
        }),
        catchError((err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Added product' });
          return of(null); 
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.router.navigate(['/dashboard']);
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
