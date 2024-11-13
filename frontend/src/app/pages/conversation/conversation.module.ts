import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationPageRoutingModule } from './conversation-routing.module';

import { ConversationPage } from './conversation.page';
import { PipeModule } from 'src/app/pipe/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationPageRoutingModule,
    PipeModule
  ],
  declarations: [ConversationPage]
})
export class ConversationPageModule {}
