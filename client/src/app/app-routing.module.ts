import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { AddPostComponent } from './posts/add-post.component';
import { OwnerListComponent } from './owners/owner-list.component';
import { OwnerProfileComponent } from './owners/owner-profile.component';
import { AddOwnerComponent } from './owners/add-owner.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'posts/new', component: AddPostComponent}
  {path: 'owners', component: OwnerListComponent},
  {path: 'owners/new', component: AddOwnerComponent},
  {path: 'owners/:id', component: OwnerProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
