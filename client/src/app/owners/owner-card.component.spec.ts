import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCardComponent } from './owner-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

describe('OwnerCardComponent', () => {
  let component: OwnerCardComponent;
  let fixture: ComponentFixture<OwnerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ OwnerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCardComponent);
    component = fixture.componentInstance;
    component.owner = {
      _id: '588935f57546a2daea44de7c',
      name: 'Rachael Johnson',
      officeID: '1310',
      email: 'rmjohns@morris.umn.edu',
      building: 'Science'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
