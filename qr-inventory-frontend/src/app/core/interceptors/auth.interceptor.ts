import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string | null | undefined;
  
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.token = this.authService.getToken();
    if(this.token){
        request = request.clone({
            setHeaders:{
                 Authorization: `Bearer ${this.token}`
            }
        })
    }
    return next.handle(request)
  }
}