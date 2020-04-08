import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note } from './note';
import { ActivatedRoute } from '@angular/router';
// this is a template for a single note essentially
@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})


export class NoteCardComponent implements OnInit, OnDestroy {
 // This would be in the doorboard component notes: Note[];
  getNotesSub: Subscription;
  public serverFilteredNotes: Note[];
  id:string
  @Input() note: Note;
  @Input() simple ? = false;
  @Output() notifyDelete: EventEmitter<string> = new EventEmitter<string>();
  confirmDelete = false;

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  getNotesFromServer(): void {
    this.getNotesSub = this.noteService.getNotes({ owner_id: this.id })
    .subscribe(notes =>
      this.serverFilteredNotes = notes.reverse()
      , err => {
      console.log(err);
    });
  }

  deleteNoteFromServer(): void {
    this.getNotesSub = this.noteService.deleteNote(this.note._id).subscribe( deleted =>{
      console.log('Note deleted');
      this.getNotesFromServer();
    }, err => {
        console.log(err);
      }

    );
  }
  ngOnInit(): void {
    this.getNotesFromServer();
  }

  ngOnDestroy(): void {
  }

}
