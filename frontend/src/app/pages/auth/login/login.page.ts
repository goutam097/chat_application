import { Component, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert/alert.service';
import { DataService } from 'src/app/service/data/data.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { StaticStorageService } from 'src/app/service/local-storage/static-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;
  details: any;

  constructor(
    private dataServe: DataService,
    private alertServe: AlertService,
    private router: Router,
    private localStorage: LocalStorageService,
    private staticStorage: StaticStorageService,
  ) {}

  ngOnInit() {}

  async userLogin(form: NgForm) {
    if (form.invalid) return;
    let jData = {
      email: this.email,
      password: this.password,
    };
    await this.dataServe.postMethod(jData, `auth/login`).then(
      async (data) => {
        const res = JSON.parse(JSON.stringify(data));
        if (res?.status == true) {
          form.resetForm();
          const userData = res?.user;
          if (userData) {
             await this.localStorage.setObject(this.staticStorage.storageName, userData).then(async (data) => {
                if (data) {
                  this.localStorage.get_all_Details();
                  this.router.navigateByUrl('conversation')
                }
              });
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
