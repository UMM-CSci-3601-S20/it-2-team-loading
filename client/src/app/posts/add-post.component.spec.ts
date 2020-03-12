import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPostService } from 'src/testing/post.service.mock';
import { AddPostComponent } from './add-post.component';
import { PostService } from './post.service';

describe('AddPostComponent', () => {
  let addPostComponent: AddPostComponent;
  let addPostForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<AddPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddPostComponent],
      providers: [{ provide: PostService, useValue: new MockPostService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddPostComponent);
    addPostComponent = fixture.componentInstance;
    addPostComponent.ngOnInit();
    fixture.detectChanges();
    addPostForm = addPostComponent.addPostForm;
    expect(addPostForm).toBeDefined();
    expect(addPostForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addPostComponent).toBeTruthy();
    expect(addPostForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addPostForm.valid).toBeFalsy();
  });

  describe('The message field', () => {
    let messageControl: AbstractControl;

    beforeEach(() => {
      messageControl = addPostComponent.addPostForm.controls[`message`];
    });

    it('should not allow empty messages', () => {
      messageControl.setValue('');
      expect(messageControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      messageControl.setValue('Chris Smith');
      expect(messageControl.valid).toBeTruthy();
    });

    it('should fail on single character message', () => {
      messageControl.setValue('x');
      expect(messageControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
      expect(messageControl.hasError('minlength')).toBeTruthy();
    });

    it('should fail on really long message', () => {
      messageControl.setValue('x'.repeat(700));
      expect(messageControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(messageControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow a message to contain a symbol', () => {
      messageControl.setValue('bad@email.com');
      expect(messageControl.valid).toBeTruthy();
    });

    it('should allow digits in the message', () => {
      messageControl.setValue('Bad2Th3B0ne');
      expect(messageControl.valid).toBeTruthy();
    });

    /*it('should fail if we provide an "existing" name', () => {
      // We're assuming that "abc123" and "123abc" already
      // exist so we disallow them.
      nameControl.setValue('abc123');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();

      nameControl.setValue('123abc');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();
    });*/
  });
});
