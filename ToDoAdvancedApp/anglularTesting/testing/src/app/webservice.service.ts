import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebserviceService {

  constructor(private httpClient:HttpClient) { }

  getPost(){
    return this.httpClient.get('https://jsonplaceholder.typicode.com/posts').pipe(
      tap((res:any)=>{
        
        
      })
    );
  }
}
