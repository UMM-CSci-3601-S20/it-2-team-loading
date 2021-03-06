import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { isObject } from 'util';


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: []
})
export class AddNoteComponent implements OnInit {

  addNoteForm: FormGroup;
  selectedTime: string;
  note: Note;
  id: string;
  timestamp: string;

  min: Date;

  max: Date;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar,
              private router: Router, private route: ActivatedRoute) {
  }


  // tslint:disable-next-line: variable-name
  add_note_validation_messages = {
    message: [
      { type: 'required', message: 'Message is required' },
      { type: 'minlength', message: 'Message is too short' },
      { type: 'maxlength', message: 'Message is too long' }
    ],
  };

  createForms() {
    this.addNoteForm = this.fb.group({
      message: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(300)
      ])),
      expireDate: new FormControl('', Validators.compose([
      ])),
    });
  }

  ngOnInit() {
    this.createForms();
    // grabbing owner id from api
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.min = new Date();
      console.log(this.min.getFullYear());
      this.max = new Date(new Date().setFullYear(this.min.getFullYear() + 5));
    });
  }

  submitForm() {
    const formResults = this.addNoteForm.value;

    const currentDate = new Date();

    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5)); // open to change to what is needed
    const timeStampDate = new Date();

    if (formResults.expireDate === '') {
      this.selectedTime = newDate.toJSON();
    } else {
      this.selectedTime = formResults.expireDate;
      console.log('The selected expire date is: ' + this.selectedTime);
      this.selectedTime = this.convertToIsoDate(this.selectedTime);
    }

    let newNote: Note;
    newNote = {
        owner_id: this.id,
        _id: undefined,
        message: formResults.message,
        expiration: this.selectedTime,
        timestamp: timeStampDate.toLocaleString('en-US'),
    };

    this.noteService.addNote(this.id, newNote).subscribe(newID => {
      this.snackBar.open('Posted', null, {
        duration: 2000,
      });
      // after submission, navigate back to the owner's doorboard
      this.router.navigate(['/owner/' + this.id + '/notes']);
    }, err => {
      this.snackBar.open('Failed to post', null, {
        duration: 2000,
      });
    });
  }
  convertToIsoDate(selectedDate: string): string {
    console.log('CALLED...');
    const tryDate = new Date(selectedDate);
    console.log('Converted Date: ' + tryDate);
    return tryDate.toISOString();
  }
}
