import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/service/alert/alert.service';
import { DataService } from 'src/app/service/data/data.service';
import { ProfileDetailsPage } from '../profile-details/profile-details.page';
import io from 'socket.io-client';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { StaticStorageService } from 'src/app/service/local-storage/static-storage.service';
import { EditMessageModalPage } from '../edit-message-modal/edit-message-modal.page';
import { CreateGroupPage } from '../create-group/create-group.page';
import { EmojiPickerComponent } from 'src/app/components/emoji-picker/emoji-picker';
// import { ChatServiceService } from 'src/app/service/chat/chat-service.service';
// import Recorder from 'recorder-js';
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  @ViewChild('commentInputRef') commentInputRef: ElementRef | undefined;
  @ViewChild('commentEmojiPicker') commentEmojiPicker: EmojiPickerComponent | any;

  allUsers: any = [];
  messages: any = [];
  connectedUsers: any = [];
  socket: any;
  userId: any;
  isInitialized: boolean = false;
  friendName: any;
  friendImage: any;
  friendId: any;
  conversationId: any;
  onlineStatus: string = 'Offline';
  newMessage: any;
  typingForId: any;
  activeUser: any = null;
  userImage: any;
  isRecording: boolean = false;
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];
  audioUrl: string | undefined;
  base64data: any;
  isTyping: boolean = false;
  typingTimeout: any;
  message: any;
  filteredUsers: any = [];

  constructor(
    private dataServe: DataService,
    private alertServe: AlertService,
    private router: Router,
    private modalController: ModalController,
    private localstorage: LocalStorageService,
    private staticStorage: StaticStorageService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  async ngOnInit() {
    if (!this.isInitialized) {
      this.isInitialized = true;

      await this.localstorage
        .getObject(this.staticStorage.storageName)
        .then(async (data: any) => {
          const details = JSON.parse(data);
          // console.log(details);
          this.userId = details._id;
          this.userImage = details?.avatarImage;
          await this.getAllUserList();
        });

      this.socket = io('http://localhost:5000');

      this.socket.emit('connected', this.userId);

      this.socket.on('connectedUsers', (users: any) => {
        this.connectedUsers = users;
      });

      // this.socket.on('message', (messagDetails: any) => {
      //   this.messages.push(messagDetails);
      // });

      this.socket.on('audio', (audio: any) => {
        this.messages.push(audio);
      });

      // this.socket.on('allMessages', (messages: any) => {
      //   this.messages = messages;
      //   this.scrollToBottom();
      // });

      this.socket.on('message', (messageDetails: any) => {
        this.messages.push(messageDetails);
        this.cdr.detectChanges();
        this.scrollToBottom();
      });

      this.socket.on('allMessages', (messages: any) => {
        this.messages = messages;
        console.log(this.messages);
        this.cdr.detectChanges();
        this.scrollToBottom();
      });

      this.socket.on('user-typing', (data: any) => {
        const { userId, conversationId } = data;
        if (conversationId == this.conversationId && userId !== this.userId) {
          this.typingForId = userId;
        }
      });

      this.socket.on('user-stop-typing', (data: any) => {
        const { userId, conversationId } = data;
        if (conversationId == this.conversationId && userId !== this.userId) {
          this.typingForId = '';
        }
      });
    }
  }

  scrollToBottom() {
    const content = document.querySelector('.chat-container');
    if (content) {
      content.scrollTop = content.scrollHeight;
    }
  }

  async ionViewWillEnter() {
    await this.ngOnInit();
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

  async changeConversation(details: any) {
    // console.log(details)
    this.activeUser = details._id;
    const payload = {
      senderId: this.userId,
      receiverId: details._id,
    };

    this.friendName = details.name;
    this.friendId = details._id;
    this.friendImage = details.image;

    await this.dataServe.postMethod(payload, `chat/createConversation`).then(
      async (data) => {
        const res = JSON.parse(JSON.stringify(data));
        this.conversationId = res?._id;
        // console.log(this.conversationId);
        this.socket.emit('joinConversation', this.conversationId);
      },
      (err) => {
        console.log(err);
      }
    );
    this.checkOnline();
  }

  checkOnline() {
    if (this.connectedUsers.some((user: any) => user == this.friendId)) {
      this.onlineStatus = 'Online';
    }
  }

  async sendMessage() {
    if (this.newMessage && this.newMessage.trim()) {
      const json = {
        senderId: this.userId,
        receiverId: this.friendId,
        conversationId: this.conversationId || null,
        message: this.newMessage,
      };
      await this.socket.emit('message', json);

      this.messages.push(json);
      this.cdr.detectChanges();

      this.newMessage = null;
      this.scrollToBottom();
    }
  }

  async startRecording() {
    // console.log('kstart');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
      })
      .catch((error) => console.error('Error accessing microphone:', error));
  }

  async stopRecording() {
    // console.log('stop');
    if (!this.mediaRecorder) return;

    this.mediaRecorder.stop();
    this.isRecording = false;

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      this.sendRecording(audioBlob);
    };
  }

  private sendRecording(audioBlob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      this.base64data = reader.result;

      const payload = {
        senderId: this.userId,
        receiverId: this.friendId,
        audio: this.base64data,
        conversationId: this.conversationId,
      };

      this.socket.emit('audio', payload);
      this.messages.push(payload);
      this.base64data = '';
    };

    reader.onerror = (error) => {
      console.error('Error reading audio blob:', error);
    };
  }

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileDetailsPage,
      backdropDismiss: false,
      cssClass: 'user_modal',
      componentProps: {},
    });
    return await modal.present();
  }

  onTyping() {
    console.log('typing');
    if (!this.isTyping) {
      this.socket.emit('typing', {
        userId: this.userId,
        conversationId: this.conversationId,
      });
      this.isTyping = true;
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
      console.log('stop');
    }, 1000);
  }

  stopTyping() {
    if (this.isTyping) {
      this.socket.emit('stop-typing', { conversationId: this.conversationId });
      this.isTyping = false;
    }
  }

  toggleOptions(message: any) {
    message.showMenu = !message.showMenu;
  }

  // Edit a message
  async editMessage(message: any) {
    const modal = await this.modalController.create({
      component: EditMessageModalPage,
      backdropDismiss: false,
      cssClass: 'edit_modal',
      componentProps: {
        message,
      },
    });
    modal.onDidDismiss().then((e) => {
      if (e?.data) {
        this.socket.emit('edit-message', {
          messageId: message._id,
          senderId: this.userId,
          message: e?.data,
          conversationId: this.conversationId,
        });
      }
      console.log(e.data, 'message');
    });
    return await modal.present();
  }

  // Delete a message
  deleteMessage(messageId: any) {
    this.socket.emit('delete-message', {
      messageId: messageId,
      senderId: this.userId,
      conversationId: this.conversationId,
    });
  }

  logout() {
    this.socket.disconnect();
    this.localstorage.logout();
    this.router.navigate(['/login']);
  }

  searchUser(ev: any) {
    console.log(ev.target.value);
    const query = ev.target.value.toLowerCase();
    this.filteredUsers = this.allUsers.filter((user: any) =>
      user.name.toLowerCase().includes(query)
    );
  }

  // create-group
  async createGroup() {
    const modal = await this.modalController.create({
      component: CreateGroupPage,
      backdropDismiss: false,
      cssClass: 'edit_group_modal',
      componentProps: {},
    });
    // modal.onDidDismiss().then((e) => {
    //   if (e?.data) {
    //     this.socket.emit('edit-message', {
    //         messageId: message._id,
    //         senderId: this.userId,
    //         message: e?.data,
    //         conversationId: this.conversationId,
    //       });
    //   }
    //   console.log(e.data,'message')
    // });
    return await modal.present();
  }

  toggleEmojiPicker(type: string): void {
    console.log(type)
    console.log(this.commentEmojiPicker)
    if (type == 'comment' && this.commentEmojiPicker) {
      // Open the emoji picker
      this.commentEmojiPicker.openEmojiPicker();

      // Use Renderer2 to manipulate the DOM
      const emojiPicker = this.commentInputRef?.nativeElement.parentNode.querySelector('.emojiPicker');
      
      // Check if emojiPicker is found and toggle visibility
      if (emojiPicker) {
        this.renderer.setStyle(emojiPicker, 'display', 'block');
      }
    } else {
      // Optionally log or handle if commentEmojiPicker is not available
      console.error('Emoji Picker is not available!');
    }
  }
}
