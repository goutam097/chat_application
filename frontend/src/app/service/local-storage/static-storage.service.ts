import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StaticStorageService {
  isDevice: boolean | undefined;
   baseUrl = 'http://localhost:5000/api/';


  storageName = 'chat';
 
  userId: any;
  isLoggedin: boolean = false;
  email: any;
  
  constructor(private route: Router) {}

   /**
   * This function is called to change router
   * @param url
   */
   routeChange(url: string) {
    this.route.navigateByUrl(url);
  }
}
