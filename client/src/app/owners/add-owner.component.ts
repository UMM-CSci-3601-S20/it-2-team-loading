import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Owner } from './owner';
import { OwnerService } from './owner.service';

@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.scss']
})
export class AddOwnerComponent implements OnInit {

  addOwnerForm: FormGroup;

  owner: Owner;

  constructor(private fb: FormBuilder, private ownerService: OwnerService, private snackBar: MatSnackBar, private router: Router) {
  }

  // currently all fields are required... unsure of how we want to handle this going forward
  add_owner_validation_messages = {
    name: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Name must contain only numbers and letters'},
      {type: 'existingName', message: 'Name has already been taken'}
    ],

    officeID: [
      // {type: 'required', message: 'Name is required'},
      // {type: 'minlength', message: 'Name must be at least 2 characters long'},
      // {type: 'maxlength', message: 'Name cannot be more than 100 characters long'},
      // {type: 'pattern', message: 'Name must contain only numbers and letters'}, // need to change this to just numbers
      // {type: 'existingName', message: 'Name has already been taken'} // probably don't care if multiple people have the same office number
    ],

    email: [
      // {type: 'email', message: 'Email must be formatted properly'},
      // {type: 'required', message: 'Email is required'}
    ],

    building: [
      // {type: 'required', message: 'Name is required'}, // should owners be required to specify the building?
      // {type: 'minlength', message: 'Name must be at least 2 characters long'},
      // {type: 'maxlength', message: 'Name cannot be more than 100 characters long'},
      // {type: 'pattern', message: 'Name must contain only numbers and letters'},
    ],
  };

  createForms() {

    // add owner form validations
    this.addOwnerForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(100),
        Validators.pattern('^[A-Za-z\\s]+[A-Za-z\\s]+$(\\.+)?'),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingName: true});
          } else {
            return null;
          }
        },
      ])),
      // empty validators for now, just want to see if the form actually gets created
      officeID: new FormControl('', Validators.compose([
      ])),
      building: new FormControl('', Validators.compose([
      ])),

      // // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      // age: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[0-9]+[0-9]?'),
      //   Validators.min(15),
      //   Validators.max(200),
      // ])),

      // // We don't care much about what is in the company field, so we just add it here as part of the form
      // // without any particular validation.
      // company: new FormControl(),

      // We don't need a special validator just for our app here, but there is a default one for email.
      // We will require the email, though.
      email: new FormControl('', Validators.compose([
        // Validators.required,
        // Validators.email,
      ])),

      // role: new FormControl('viewer', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^(admin|editor|viewer)$'),
      // ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.ownerService.addOwner(this.addOwnerForm.value).subscribe(newID => {
      this.snackBar.open('Added Owner ' + this.addOwnerForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/owners/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the owner', null, {
        duration: 2000,
      });
    });
  }

}
