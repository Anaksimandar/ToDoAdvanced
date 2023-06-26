import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WebClientService {
  private readonly url:string;
  constructor(private httpClient:HttpClient) { 
    this.url = 'http://localhost:5000';
  }

  get(uri:string){
    return this.httpClient.get(`${this.url}/${uri}`);
  }

  post(uri:string,params:object){
    return this.httpClient.post(`${this.url}/${uri}`,params);
  }

  patch(uri:string,params:object){
    return this.httpClient.patch(`${this.url}/${uri}`,params);
  }

  delete(uri:string){
    return this.httpClient.get(`${this.url}/${uri}`);
  }
  login(email:string, password: string){
    return this.httpClient.post(`${this.url}/users/sign-up`,
    {
      email,
      password,
    },
    {
      observe:'response'
    }
    );
  }



}
