import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/service/alert/alert.service';
import { DataService } from 'src/app/service/data/data.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { StaticStorageService } from 'src/app/service/local-storage/static-storage.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  name: any;
  email: any;
  password: any;
  sessionIsLoggedin: boolean = false;
  userId: any;
  profileImage: any;
  defaultImage : any = "https://plus.unsplash.com/premium_photo-1673448391005-d65e815bd026?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8fDA%3D"
  userImage: any;
  phone: any;


  constructor(
    private dataServe: DataService,
    private alertServe: AlertService,
    private router: Router,
    private modalController: ModalController,
    private localStorage: LocalStorageService,
    private staticStorage: StaticStorageService
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  async checkSession() {
    await this.localStorage
      .getObject(this.staticStorage.storageName)
      .then((resu) => {
        const sess = JSON.parse(resu);
        console.log(sess,'dfdsfdssdjsd')
        if (sess !== null) {
          this.sessionIsLoggedin = true;
          this.userId = sess._id;
           this.userDetalisApi();
        }
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async ionViewWillEnter() {
  }

  async userDetalisApi() {
    await this.dataServe
      .getMethod(
        `auth/userDetails/${this.userId}`
      )
      .then(
        async (data) => {
          const res = JSON.parse(JSON.stringify(data));
          if (res) {
            this.name = res?.data?.name;
            this.userImage = res?.data?.image;
            this.email = res?.data?.email;
            this.phone = res?.data?.phone;
          }
        },
        (err) => {
          this.alertServe.presentToast(err?.message);
        }
      );
  }

  removeProfileImage() {
    this.profileImage = { file: '', filename: '' };
  }

  uploadProfileImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
  
    if (!file || !allowedTypes.includes(file.type)) {
      this.alertServe.presentToast('Only jpg, jpeg, and png files are allowed.');
      return;
    }
  
    if (file.size >= 1100000) { 
      this.alertServe.presentToast('Image size must be under 1MB.');
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      this.profileImage = { file, url: reader.result as string, filename: file.name };
      console.log(this.profileImage)
    };
    reader.readAsDataURL(file); 
  }
  
  async userProfileUpdate(form: NgForm) {
    if (form.invalid) return;
  
    const formData = new FormData();
    formData.append('username', this.name);
    if (this.profileImage?.file) {
      formData.append('image', this.profileImage.file, this.profileImage.filename);
    }
  
    try {
      const data = await this.dataServe.postMethod(formData, `auth/updateDetails/${this.userId}`);
      const res = JSON.parse(JSON.stringify(data));
      if (res) {
        this.modalController.dismiss();
        this.alertServe.presentToast('Profile updated successfully.');
      }
    } catch (err) {
      console.error(err);
      this.alertServe.presentToast('Error updating profile. Please try again.');
    }
  }

}
