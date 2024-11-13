import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/service/alert/alert.service';
import { DataService } from 'src/app/service/data/data.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { StaticStorageService } from 'src/app/service/local-storage/static-storage.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  allUsers: any = [];
  userId: any;
  filteredUsers: any = [];
  isGroupSelected: boolean = false;

  constructor(
    private modalController: ModalController,
    private dataServe: DataService,
    private alertServe: AlertService,
    private router: Router,
    private localstorage: LocalStorageService,
    private staticStorage: StaticStorageService,
  ) { }

  ngOnInit() {
    this.checkSession()
  }

  async checkSession() {
    await this.localstorage
      .getObject(this.staticStorage.storageName)
      .then((resu) => {
        const sess = JSON.parse(resu);
        console.log(sess,'dfdsfdssdjsd')
        if (sess !== null) {
          this.userId = sess._id;
           this.getAllUserList();
        }
      });
  }

  closeModal(){
    this.modalController.dismiss();
  }

  async getAllUserList() {
    await this.dataServe.getMethod(`auth/allUserList/${this.userId}`).then(
      async (data) => {
        const res = JSON.parse(JSON.stringify(data));
        if (res?.status == true) {
          this.allUsers = res?.users;
          this.filteredUsers = [...this.allUsers];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  searchUser(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredUsers = query
      ? this.allUsers.filter((user:any) => user.name.toLowerCase().includes(query))
      : [...this.allUsers]; // Reset if query is empty
  }

  selectUser(user: any) {
    user.isSelected = !user.isSelected; // Toggle selection state
  }

  onCheckboxChange(user: any) {
    console.log(`${user.name} selection changed to: ${user.isSelected}`);
  }

  selectGroupMembers(){
    this.isGroupSelected = true
  }
}
