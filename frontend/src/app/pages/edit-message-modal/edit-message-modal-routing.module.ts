import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMessageModalPage } from './edit-message-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditMessageModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMessageModalPageRoutingModule {}
