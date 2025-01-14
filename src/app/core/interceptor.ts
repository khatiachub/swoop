import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const myToken = localStorage.getItem("token");
    if (myToken) {
      const cloneRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${myToken}`
        }
      });
      return next(cloneRequest);
    }
  }
  return next(req);
};