import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebClientService } from './services/web-client.service';
import { shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http:HttpClient, public webService:WebClientService, private router:Router) {}

  login(email:string,password:string){
    return this.webService.login(email,password).pipe(
      shareReplay(), // we use this method to dont let multiply sub to start multiply executions on this method
      tap((res:HttpResponse<any>)=>{
        console.log('TAP TAP');
        
        // the auth token will be in the header of this response 
        // this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'))
        this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
        this.router.navigate(['/']);
        
      })
    )
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }

  setRefreshToken(refreshToken:string){
    localStorage.setItem('x-refresh-token',refreshToken);
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken:string){
    localStorage.setItem('x-access-token',accessToken);
  }

  private setSession(userId:string, accessToken:string, refreshToken:string){
    localStorage.setItem('user_id', userId);
    localStorage.setItem('x-access-token',accessToken)
    localStorage.setItem('x-refresh-token',refreshToken)
    window.alert('Items set successfully');
  }

  private removeSession(){
    localStorage.removeItem('user_id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  private getUserId(){
    return localStorage.getItem('user_id');
  }

  logout(){
    this.removeSession();
    this.router.navigate(['/login']);
  }

  refreshToken(){
    return this.http.get(`${this.webService.url}/me/access-token'`,{
      headers:{
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe:'response'
    })
    .pipe(
      tap((res:HttpResponse<any>)=>{
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }


}
