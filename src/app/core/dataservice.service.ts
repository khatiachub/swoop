import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { }
  private url = "http://localhost:5257/api/Product"
  private userurl = "http://localhost:5257/api/User"

  private cartQuantitySubject = new BehaviorSubject<number>(0); 
  cartQuantity$ = this.cartQuantitySubject.asObservable();

  quantity=0;
  register(data: any): Observable<any> { 
    return this.http.post(`${this.userurl}/CreateUser`, data);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.userurl}/LoginUser`, data);
  }
  getUser(id: number|null): Observable<any> {
    return this.http.get(`${this.userurl}/GetUser/${id}`);
  }
  updateUser(id: number|null,data:any): Observable<any> {
    return this.http.put(`${this.userurl}/UpdateUser/${id}`,data);
  }
  deleteUser(id: number|null): Observable<any> {
    return this.http.delete(`${this.userurl}/deleteUser/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.url}/GetCategories`);
  }
  addCategories(data: any): Observable<any> {
    return this.http.post(`${this.url}/AddCategories`, data);
  }
  addCategoryChild(data: any): Observable<any> {
    return this.http.post(`${this.url}/AddCategories1Child`, data);
  }
  addProduct(data: any,id:number): Observable<any> {
    return this.http.post(`${this.url}/AddItemDescription/${id}`, data);
  }
  getChildCategories(id: number | null): Observable<any> {
    return this.http.get(`${this.url}/GetCategories1st/${id}`);
  }
  getFilteredItems(id: number | null, category: null | string): Observable<any> {
    const url = `${this.url}/GetFilteredItems/${id}/${category}`;
    return this.http.get(url);
  }
  getSearchedProducts(productName:string): Observable<any> {
    const url = `${this.url}/GetSearchedProducts/${productName}`;
    return this.http.get(url);
  }
  getProducts(): Observable<any> {
    const url = `${this.url}/GetProducts/`;
    return this.http.get(url);
  }
  getLocations(id: number | null): Observable<any> {
    return this.http.get(`${this.url}/GetLocations/${id}`);
  }
  getGuestNumber(category_id:number|null): Observable<any> {
    return this.http.get(`${this.url}/GetGuestNumber/${category_id}`);
  }
  getFilteredLocations(id: number | null, queryParams: { [key: string]: string | number | boolean }): Observable<any> {
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams[key]) {
        params = params.set(key, queryParams[key].toString());
      }
    }
    const url = `${this.url}/Getlocations/${id}`;
    return this.http.get(url, { params });
  }

  getProductDescription(id: number | null): Observable<any> {
    return this.http.get(`${this.url}/GetProductDescription/${id}`);
  }
  getBasket(id: number | null): Observable<any> {
    return this.http.get(`${this.url}/GetBasket/${id}`).pipe(
      tap((response: any) => {
        response.forEach((item: { total_quantity: number; })=>(this.quantity=item.total_quantity))
        this.cartQuantitySubject.next(this.quantity); 
      })
    );
  }
  addToBasket(data: any): Observable<any> {
    return this.http.post(`${this.url}/AddToCart`, data);
  }
  deletefrombasket(userid:number|null,productid:number): Observable<any> {
    return this.http.delete(`${this.url}/deletefromcart/${userid}/${productid}`);
  }
  updateCartQuantity(quantity: number) {
    this.cartQuantitySubject.next(quantity);
  }

  getCartQuantity(): number {
    return this.cartQuantitySubject.value;
  }
  updateBasket(data: any): Observable<any> {
    return this.http.put(`${this.url}/updatebasket`, data);
  }
}
