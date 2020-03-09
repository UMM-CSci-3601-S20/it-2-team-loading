import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPostComponent } from './posts/add-post.component';
import { OwnerListComponent } from './owners/owner-list.component';
import { OwnerProfileComponent } from './owners/owner-profile.component';
import { AddOwnerComponent } from './owners/add-owner.component';
import { PostListComponent } from './posts/post-list.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'posts/new', component: AddPostComponent},
  {path: 'posts', component: PostListComponent}, // probably going to be a temporary route
  {path: 'owners', component: OwnerListComponent},
  {path: 'owners/new', component: AddOwnerComponent},
  {path: 'owners/:id', component: OwnerProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
