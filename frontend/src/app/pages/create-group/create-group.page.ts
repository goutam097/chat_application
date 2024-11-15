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
  selectedUserIds: any = [];
  description: any;
  groupImage: any;
  accessToken: any;

  constructor(
    private modalController: ModalController,
    private dataServe: DataService,
    private alertServe: AlertService,
    private router: Router,
    private localstorage: LocalStorageService,
    private staticStorage: StaticStorageService
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  async checkSession() {
    await this.localstorage
      .getObject(this.staticStorage.storageName)
      .then((resu) => {
        const sess = JSON.parse(resu);
        console.log(sess, 'dfdsfdssdjsd');
        if (sess !== null) {
          this.userId = sess._id;
          this.accessToken = sess.token;
          this.getAllUserList();
        }
      });
  }

  closeModal() {
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
      ? this.allUsers.filter((user: any) =>
          user.name.toLowerCase().includes(query)
        )
      : [...this.allUsers];
  }

  onCheckboxChange(user: any): void {
    if (user.isSelected) {
      this.selectedUserIds.push(user._id);
    } else {
      const index = this.selectedUserIds.indexOf(user._id);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1);
      }
    }
  }

  selectGroupMembers() {
    this.isGroupSelected = true;
  }

  uploadProfileImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (file && allowedTypes.includes(file.type) && file.size < 1100000) {
      this.groupImage = { file, url: URL.createObjectURL(file) };
      console.log(this.groupImage);
    } else {
      this.alertServe.presentToast(
        'Only jpg, jpeg, and png files under 1MB are allowed.'
      );
    }
  }

  async createGroupApi() {
    if (!this.description || this.selectedUserIds.size === 0) {
      this.alertServe.presentToast(
        'Description and at least one user are required.'
      );
      return;
    }
    const userIdsArray = Array.from(this.selectedUserIds).map((userId) => ({
      memberId: userId,
      isAdmin: false,
    }));

    const formData = new FormData();
    formData.append('members', JSON.stringify(userIdsArray));
    formData.append('description', this.description);

    if (this.groupImage?.file) {
      formData.append('image', this.groupImage.file);
    }

    try {
      const data = await this.dataServe.postMethodWithToken(
        formData,
        `group/create-group`,
        this.accessToken
      );
      const res = data as { status: boolean; message: string };
      if (res?.status) {
        this.modalController.dismiss();
      } else {
        this.alertServe.presentToast(res?.message || 'Failed to create group');
      }
    } catch (err) {
      console.log(err);
      this.alertServe.presentToast(
        'An error occurred while creating the group'
      );
    }
  }
}
