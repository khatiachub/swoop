import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http:HttpClient) { }
  private url="http://localhost:5257/api/Main"



  // registration(data: any): Observable<any> { 
  //   return this.http.post(`${this.url}/CreateAdmin`, data);
  // }
  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.url}/LoginAdmin`, data);
  // }
  // addQuestion(data: any): Observable<any> {
  //   return this.http.post(`${this.url}/AddQuestion`, data);
  // }
  getCategories(): Observable<any> {
    return this.http.get(`${this.url}/GetCategories`);
  }
  getCategory(name:string|null,id:number|null): Observable<any> {
    return this.http.get(`${this.url}/GetCategories2st/${id}/${name}`);
  }
  getChildCategories(id:number|null): Observable<any> {
    return this.http.get(`${this.url}/GetCategories1st/${id}`);
  }
  getFilteredItems(id:number|null,category: null|string,queryParams:any): Observable<any> {
    let params = new HttpParams();
  for (const key in queryParams) {
    if (queryParams[key]) {
      params = params.set(key, queryParams[key].toString()); 
    }
  }
  const url = `${this.url}/GetFilteredItems/${id}/${category}`;
  return this.http.get(url, { params });
  }
  getLocations(): Observable<any> {
    return this.http.get(`${this.url}/GetLocations/`);
  }
  getGuestNumber(): Observable<any> {
    return this.http.get(`${this.url}/GetGuestNumber/`);
  }
  getFilteredLocations(queryParams: { [key: string]: string | number | boolean }): Observable<any> {
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams[key]) {
        params = params.set(key, queryParams[key].toString()); 
      }
    }
    const url = `${this.url}/Getlocations/`;
    return this.http.get(url, {params });
  }
 
}
