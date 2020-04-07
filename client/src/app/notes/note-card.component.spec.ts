import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockNoteService } from '../../testing/note.service.mock';
import { Note } from './note';
import { NoteCardComponent } from './note-card.component';
import { NoteService } from './note.service';
import { MatIconModule } from '@angular/material/icon';
import { splitClasses } from '@angular/compiler';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('NoteCardComponent', () => {
  let noteCard: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [NoteCardComponent],
      providers: [{ provide: NoteService, useValue: new MockNoteService() }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(NoteCardComponent);
      noteCard = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the notes', () => {
    expect(noteCard.serverFilteredNotes.length).toBe(3);
  });

  it('contains a message \'Spirate pur, Spirate\'', () => {
    expect(noteCard.serverFilteredNotes.some((note: Note) => note.message === 'Spirate pur, Spirate')).toBe(true);
  });
});
