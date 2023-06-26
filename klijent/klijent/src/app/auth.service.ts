import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebClientService } from './services/web-client.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http:HttpClient, public webService:WebClientService,) {}

  login(email:string,password:string){
    return this.webService.login(email,password).pipe(
      // shareReplay(), // we use this method to dont let multiply sub to start multiply executions on this method
      tap((res:HttpResponse<any>)=>{
        console.log('TAP TAP');
        
        // the auth token will be in the header of this response 
        // this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'))
        this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
        
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
    localStorage.setItem('access-token',accessToken)
    localStorage.setItem('refresh-token',refreshToken)
    window.alert('Items set successfully');
  }

  private removeSession(){
    localStorage.removeItem('user_id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  logout(){
    this.removeSession();
  }

}
