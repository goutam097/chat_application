import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMessageModalPageRoutingModule } from './edit-message-modal-routing.module';

import { EditMessageModalPage } from './edit-message-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMessageModalPageRoutingModule
  ],
  declarations: [EditMessageModalPage]
})
export class EditMessageModalPageModule {}
