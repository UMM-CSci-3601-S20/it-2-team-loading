import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { OwnerListComponent } from './owners/owner-list.component';
import { HomeComponent } from './home/home.component';
import { OwnerService } from './owners/owner.service';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AddNoteComponent } from './notes/add-note.component';
import { NoteService } from './notes/note.service';
import { OwnerCardComponent } from './owners/owner-card.component';
import { OwnerDoorBoardComponent } from './owners/owner-doorboard.component';
import { AddOwnerComponent } from './owners/add-owner.component';
import { NoteCardComponent } from './notes/note-card.component' ;

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


const MATERIAL_MODULES: any[] = [
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddNoteComponent,
    NoteCardComponent,
    OwnerListComponent,
    OwnerCardComponent,
    OwnerDoorBoardComponent,
    AddOwnerComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MATERIAL_MODULES,
    LayoutModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],

  providers: [
    NoteService,
    OwnerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
