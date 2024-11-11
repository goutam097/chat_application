import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StaticStorageService } from '../local-storage/static-storage.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private platform: Platform,
    private staticData: StaticStorageService,
    private storage: LocalStorageService,
    private route: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const that = this;
    console.log("auth gard service");
    return new Observable(observer => {
      that.platform.ready().then(() => {
        that.storage.getObject(this.staticData.storageName).then(async val => {
          await that.storage.get_all_Details();
          let sess = JSON.parse(val);
          if(sess) {
            if ((state.url == '/login') ) {
              observer.next(true);
            } else {
              observer.next(true);
             // that.staticData.routeChange('login');
            }
          }else{
            observer.next(true);
          //  that.staticData.routeChange('login');
          }
        });
      });
    });
  }
}
