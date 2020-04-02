import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCardComponent } from './note-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ NoteCardComponent ]
    })
    .compileComponents();
  }));
/* Create a mock note here and create some more tests
  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCardComponent);
    component = fixture.componentInstance;
    component.note = {
      _id: '588935f57546a2daea44de7c',
      name: 'Rachael Johnson',
      officeID: '1310',
      email: 'rmjohns@morris.umn.edu',
      building: 'Science'
    };
    fixture.detectChanges();
  });
*/
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
