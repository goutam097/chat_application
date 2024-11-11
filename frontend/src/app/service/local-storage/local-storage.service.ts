import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StaticStorageService } from './static-storage.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private userDetails = new Subject<string>();

  constructor(
    private storage: Storage,
    private stData: StaticStorageService,
    private platform: Platform,
    private router: Router
  ) { }

  /**
   * this function is called to set data in key value pair from storage
   */
  async set(key: string, value: any): Promise<any> {
    try {
      await this.storage.create();
      const result = await this.storage.set(key, value);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * this function is called to get data in key value pair from storage
   */
  async get(key: string): Promise<any> {
    try {
      await this.storage.create();
      const result = await this.storage.get(key);
      if (result != null) {
        return result;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * this function is called to set a object in key value pair
   */
  async setObject(key: string, object: Object) {
    try {
      console.log(object, " object ")
      await this.storage.create();
      const result = await this.storage.set(key, JSON.stringify(object));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public getObservableDetails(): Observable<string> {
    return this.userDetails.asObservable();
  }

  public setObservableDetails(data: any) {
    this.userDetails.next(data);
  }

  /**
   * this function is called to get a object in key value pair
   */
  async getObject(key: string): Promise<any> {
    try {
      await this.storage.create();
      const result = await this.storage.get(key);
      if (result != null) {
        return result;
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }

  /**
   * this function is called to get Login data
   */
  async getLoginData(): Promise<any> {
    try {
      await this.storage.create();
      const result = await this.storage.get(this.stData.storageName);
      await this.get_all_Details();
      if (result != null) {
        return result;
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }

  /**
   * this function is called to get user details
   */
  async get_all_Details() {
    try {
      await this.getObject(this.stData.storageName).then((resu) => {
        console.log(resu,'ttototototototo')
        const sess = JSON.parse(resu);
        
        if (sess) {
          this.stData.isLoggedin = true;
          this.stData.userId = sess._id;
          this.stData.email = sess.email;
        } else {
          this.stData.isLoggedin = false;
          this.stData.userId = null;
          this.stData.email = null;

        }
      });
    } catch (reason) {
      console.log(reason);
    }
  }

  /**
   * Logout a user from the session
   */
  async logout() {
    this.storage.create();
    this.storage.remove(this.stData.storageName).then((sessdata) => {
      this.storage.clear();
      this.storage.clear();
      this.stData.isLoggedin = false;
      this.stData.userId = null;
      this.stData.email = null;
      this.setObservableDetails('logout');
      const fullUrl = this.platform.url() || '';
      const path = this.router.url || '';
      const domain = fullUrl.split(path)[0];
      window.location.href = `${domain}/login`;
    });
  }
}
