import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'conversation',
    loadChildren: () => import('./pages/conversation/conversation.module').then( m => m.ConversationPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile-details',
    loadChildren: () => import('./pages/profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  },
  {
    path: 'edit-message-modal',
    loadChildren: () => import('./pages/edit-message-modal/edit-message-modal.module').then( m => m.EditMessageModalPageModule)
  },
  {
    path: 'create-group',
    loadChildren: () => import('./pages/create-group/create-group.module').then( m => m.CreateGroupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
