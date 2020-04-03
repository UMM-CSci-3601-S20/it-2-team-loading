import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
  id: string;
  @Input() note: Note;
  @Input() simple ? = false;

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
