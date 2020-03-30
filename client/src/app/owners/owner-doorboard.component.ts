import { Component, OnInit, OnDestroy, Input,Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Owner } from './owner';
import { OwnerService } from './owner.service';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note } from '../notes/note';

@Component({
  selector: 'app-owner-doorboard',
  templateUrl: './owner-doorboard.component.html',
  styleUrls: ['./owner-doorboard.component.scss']
})


// This class has access to the owner of the doorboard, and all the notes that said owner has made
export class OwnerDoorBoardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private noteService: NoteService,
              private ownerService: OwnerService) { }
  notes: Note[];
  owner: Owner;
  id: string;
  getNotesSub: Subscription;
  getOwnerSub: Subscription;
  @Input() note: Note;
  @Output() notifyDelete: EventEmitter<string> = new EventEmitter<string>();
  confirmDelete = false;
  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested owner.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.getOwnerSub = this.ownerService.getOwnerById(this.id).subscribe(owner => this.owner = owner);
      this.getNotesSub = this.noteService.getOwnerNotes({ owner_id: this.id }).subscribe(notes => this.notes = notes.reverse());

    });
  }

  ngOnDestroy(): void {
    if (this.getNotesSub) {
      this.getNotesSub.unsubscribe();
    }
    if (this.getOwnerSub) {
      this.getOwnerSub.unsubscribe();
    }
  }

  deleteNote(){
    this.noteService.deleteNote(this.note._id);
    this.notifyDelete.emit(this.note._id);
  }
}
