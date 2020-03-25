import { Component, OnInit } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: []
})
export class AddNoteComponent implements OnInit {

  addNoteForm: FormGroup;

  note: Note;
  id: string;

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
    // owner: [
    //   { type: 'required', message: 'Owner is required' },
    // ]
  };

  createForms() {
    this.addNoteForm = this.fb.group({
      message: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(550)
      ])),
      // owner: new FormControl('', Validators.compose([
      //   Validators.required,
      // ]))
    });
  }

  ngOnInit() {
    this.createForms();
    // grabbing owner id from api
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
  }

  submitForm() {
    const formResults = this.addNoteForm.value;

    const currentDate = new Date();
    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5));
    console.log('TIMES!!!!:\n'
    + 'JSON: ' + newDate.toJSON() + '\n'
    + 'ISO: ' + newDate.toISOString() + '\n'
    + 'UTC: ' + newDate.toUTCString() + '\n'
    + 'DATE: ' + newDate.toDateString() + '\n'
    );
    const newNote: Note = {
      owner_id: this.id,
      _id: undefined,
      //owner: formResults.owner,
      message: formResults.message,
      expiration: newDate.toJSON(),
    };

    this.noteService.addNote(this.id, newNote).subscribe(() => {
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
}
