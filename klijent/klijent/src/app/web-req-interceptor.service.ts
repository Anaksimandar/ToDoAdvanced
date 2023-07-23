import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, empty, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptorService implements HttpInterceptor {

  constructor(private authService:AuthService) { }

  // Pre nego sto posaljemo zahtev serveru, za liste i zadatke korisnika, moramo da dodamo tokene u zaglavlje zahteva
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      req = this.setHeaders(req);
      return next.handle(req).pipe(
        catchError((err:HttpErrorResponse)=>{
          console.log(err);
          if(err.status === 401){
            // unauthorizied
            return this.refreshToken().pipe(
              switchMap(()=>{
                req = this.setHeaders(req);
                return next.handle(req);
              }),
              catchError((err:any)=>{
                console.log(err);
                this.authService.logout();
                return empty(err);
              })
            )
          }
          return throwError(err);
        })
      )
  }

  setHeaders(req:HttpRequest<any>):HttpRequest<any>{
    const token = this.authService.getAccessToken();
    if(token){
      return req.clone(
        {setHeaders:{'x-access-token':token}}
      )
    }
    return req;
    
  }

  refreshToken(){
    return this.authService.refreshToken().pipe(
      tap((res)=>{
        console.log(res);
      })
    )
  }

}
