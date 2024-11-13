import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-edit-message-modal',
  templateUrl: './edit-message-modal.page.html',
  styleUrls: ['./edit-message-modal.page.scss'],
})
export class EditMessageModalPage implements OnInit {
  message: any;
  userMessage: any;
  messageId: any;

  constructor(
    private navParam: NavParams,
    private modalController: ModalController

  ) { }

  ngOnInit() {
    this.userMessage = this.navParam.get('message');
    this.message = this.userMessage.message;
    this.messageId = this.userMessage._id;
    console.log(this.message)
  }

  closeModal(){
    this.modalController.dismiss();
  }

  handleSubmit(){
    this.modalController.dismiss(this.message);
  }

}
