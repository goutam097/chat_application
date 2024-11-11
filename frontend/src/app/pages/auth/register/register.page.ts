import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert/alert.service';
import { DataService } from 'src/app/service/data/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: any;
  email: any;
  mobile: any;
  password: any;

  constructor(
    private dataServe : DataService,
    private alertServe : AlertService,
    private router : Router,
  ) { }

  ngOnInit() {
  }

  async userRegistration(form:NgForm) {
    if(form.invalid) return;
    let jData = {
      username : this.name,
      email : this.email,
      mobile : this.mobile,
      password : this.password,
    }
    await this.dataServe
      .postMethod(jData,
        `auth/register`
      )
      .then(
        async (data) => {
          const res = JSON.parse(JSON.stringify(data));
          if (res?.status == true) {
            this.router.navigateByUrl('login')
           this.alertServe.presentToast(`Thank you register`)
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
