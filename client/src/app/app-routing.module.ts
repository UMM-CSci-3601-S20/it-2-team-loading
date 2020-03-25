import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddNoteComponent } from './notes/add-note.component';
import { OwnerListComponent } from './owners/owner-list.component';
import { OwnerDoorBoardComponent } from './owners/owner-doorboard.component';
import { AddOwnerComponent } from './owners/add-owner.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'owner/:id/notes/new', component: AddNoteComponent},
  {path: 'owners', component: OwnerListComponent},
  {path: 'owners/new', component: AddOwnerComponent},
  {path: 'owner/:id/notes', component: OwnerDoorBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
