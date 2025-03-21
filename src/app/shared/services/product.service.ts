import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductDTO } from '../interface/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList():Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>('https://fakestoreapi.com/products')
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://fakestoreapi.com/products/categories')
  }

  addProduct(Product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>('https://fakestoreapi.com/products', Product)
  }

  updateProduct(id: number, product :ProductDTO) {
    return this.http.patch<ProductDTO>(`https://fakestoreapi.com/products/${id}`, product)
  }

  deleteProduct(id:number) {
    return this.http.delete<ProductDTO>(`https://fakestoreapi.com/products/${id}`);
  }
}
