import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { StaticStorageService } from '../local-storage/static-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private stData: StaticStorageService,
    private router: Router,
    public alert:AlertController,
    private toast: ToastController,
  ) { }



  /**
  * this function is called to display error alert 
  */
  async errorAlert(msg: string) {
    if (this.stData.isDevice) {
      this.presentToast(msg);
    } else {
      const alert = await this.alert.create({
        header: 'Error!',
        message: msg,
        cssClass: 'langDelete',
        buttons: [
          {
            text: 'Ok',
            cssClass: 'secondary',
            role: "cancel"
          }
        ]
      });
      await alert.present();
    }
  }



  /**
   * this function is called to display success alert 
   */
  async successAlert(msg: string) {
    if (this.stData.isDevice) {
      this.presentToast(msg);
    } else {
      const alert = await this.alert.create({
        header: 'Success',
        message: msg,
        cssClass: 'langDelete',
        buttons: [
          {
            text: 'Ok',
            cssClass: 'secondary',
            role: "cancel"
          }
        ]
      });
      await alert.present();
    }
  }



  /**
   * this function is called to display success alert 
   */
  async customAlert(header: string, msg: string) {
    if (this.stData.isDevice) {
      this.presentToast(msg);
    } else {
      const alert = await this.alert.create({
        header: header,
        message: msg,
        cssClass: 'langDelete',
        buttons: [
          {
            text: 'Ok',
            cssClass: 'secondary',
            role: "cancel"
          }
        ]
      });
      await alert.present();
    }
  }



  /**
   * this function is called to display Toast msg 
   */
  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }



  /**
   * this function is call to go notification
   * @param data 
   */
  async pushNotificationPresentToast(data: any) {
    console.log(data)
    const toast = await this.toast.create({
      header: data.title,
      message: data.body,
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          text: 'Open',
          role: 'cancel',
          handler: () => {
            if (data.page == "new-delivery") {
              this.stData.routeChange('/new-delivery/' + Number(data.orderId))
            }
          }
        }
      ]
    });
    toast.present();
  }
  /**
   * Dev: goutam
   * Desc: success alert link with routing link.
   * @param msg 
   * @param link 
   */
  async successAlertWithLink(msg: string, link: string | UrlTree) {
    const alert = await this.alert.create({
      header: 'Success',
      message: msg,
      cssClass: 'langDelete',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'secondary',
          handler: () => {
            if (link) {
              //window.open(link,'_blank')
              this.router.navigateByUrl(link)
            }
          }
        }
      ]
    });
    await alert.present();

  }

  async errorAlertWithLink(msg: string, link: string | UrlTree) {
    const alert = await this.alert.create({
      header: 'Error',
      message: msg,
      cssClass: 'langDelete',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'secondary',
          handler: () => {
            if (link) {
              //window.open(link,'_blank')
              this.router.navigateByUrl(link)
            }
          }
        }
      ]
    });
    await alert.present();
  }
}

