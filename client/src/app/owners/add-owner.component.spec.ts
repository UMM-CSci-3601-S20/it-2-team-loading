import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOwnerService } from 'src/testing/owner.service.mock';
import { AddOwnerComponent } from './add-owner.component';
import { OwnerService } from './owner.service';

describe('AddOwnerComponent', () => {
  let addOwnerComponent: AddOwnerComponent;
  let addOwnerForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<AddOwnerComponent>;

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
      declarations: [AddOwnerComponent],
      providers: [{ provide: OwnerService, useValue: new MockOwnerService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddOwnerComponent);
    addOwnerComponent = fixture.componentInstance;
    addOwnerComponent.ngOnInit();
    fixture.detectChanges();
    addOwnerForm = addOwnerComponent.addOwnerForm;
    expect(addOwnerForm).toBeDefined();
    expect(addOwnerForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addOwnerComponent).toBeTruthy();
    expect(addOwnerForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addOwnerForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addOwnerComponent.addOwnerForm.controls[`name`];
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      nameControl.setValue('Chris Smith');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on single character names', () => {
      nameControl.setValue('x');
      expect(nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
      expect(nameControl.hasError('minlength')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      nameControl.setValue('x'.repeat(200));
      expect(nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should fail if we provide an "existing" name', () => {
      // We're assuming that "abc123" and "123abc" already
      // exist so we disallow them.
      nameControl.setValue('abc123');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();

      nameControl.setValue('123abc');
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('existingName')).toBeTruthy();
    });
  });

  describe('The officeID field', () => {
    let officeIDControl: AbstractControl;

    beforeEach(() => {
      officeIDControl = addOwnerComponent.addOwnerForm.controls[`officeID`];
    });

    it('should not allow empty values', () => {
      officeIDControl.setValue('');
      expect(officeIDControl.valid).toBeFalsy();
      expect(officeIDControl.hasError('required')).toBeTruthy();
    });

    it('should accept legal officeID\'s', () => {
      officeIDControl.setValue('114');
      expect(officeIDControl.valid).toBeTruthy();
      expect(officeIDControl.hasError('officeID')).toBeFalsy();
    });


    it('should not allow overly long officeID numbers', () => {
      officeIDControl.setValue('x'.repeat(50));
      expect(officeIDControl.valid).toBeFalsy();
      expect(officeIDControl.hasError('maxlength'));
    });


  });

  describe('The email field', () => {
    let emailControl: AbstractControl;

    beforeEach(() => {
      emailControl = addOwnerComponent.addOwnerForm.controls[`email`];
    });

    it('should not allow empty values', () => {
      emailControl.setValue('');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('required')).toBeTruthy();
    });

    it('should accept legal emails', () => {
      emailControl.setValue('conniestewart@ohmnet.com');
      expect(emailControl.valid).toBeTruthy();
    });

    it('should fail without @', () => {
      emailControl.setValue('conniestewart');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('email')).toBeTruthy();
    });
  });

  describe('The building field', () => {
    let buildingControl: AbstractControl;

    beforeEach(() => {
      buildingControl = addOwnerComponent.addOwnerForm.controls[`building`];
    });

    it('should allow empty building fields', () => {
      buildingControl.setValue('');
      expect(buildingControl.valid).toBeTruthy();
    });

    it('should be fine with "Chris Smith"', () => {
      buildingControl.setValue('Chris Smith');
      expect(buildingControl.valid).toBeTruthy();
    });


    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like building lengths just
    // because there are people with really long buildings.
    it('should fail on really long building names', () => {
      buildingControl.setValue('x'.repeat(200));
      expect(buildingControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(buildingControl.hasError('maxlength')).toBeTruthy();
    });

  });

});
