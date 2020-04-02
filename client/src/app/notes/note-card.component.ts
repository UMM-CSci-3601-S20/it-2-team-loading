import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note } from './note';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit, OnDestroy {
  notes: Note[];
  id: string;
  getNotesSub: Subscription;
  @Input() note: Note;
  @Input() simple ? = false;

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.getNotesSub = this.noteService.getOwnerNotes({ owner_id: this.id }).subscribe(notes =>
         this.notes = notes.reverse()
         );
    });
  }

  ngOnDestroy(): void {
    if (this.getNotesSub) {
      this.getNotesSub.unsubscribe();
    }
  }

}
