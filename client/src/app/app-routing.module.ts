import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPostComponent } from './posts/add-post.component';
import { OwnerListComponent } from './owners/owner-list.component';
import { OwnerDoorBoardComponent } from './owners/owner-doorboard.component';
import { AddOwnerComponent } from './owners/add-owner.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'owner/:id/posts/new', component: AddPostComponent},
  {path: 'owners', component: OwnerListComponent},
  {path: 'owners/new', component: AddOwnerComponent},
  {path: 'owner/:id/posts', component: OwnerDoorBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
