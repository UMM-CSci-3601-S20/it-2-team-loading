import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from '../app/notes/note';
import { NoteService } from '../app/notes/note.service';


/**
 * A "mock" version of the `NoteService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockNoteService extends NoteService {
  static testNotes: Note[] = [
    {
      _id: 'one_id',
      message: 'Spirate pur, Spirate',
      owner_id: 'Aladdin',
      expiration: 'N/A',
    },
    {
      _id: 'two_id',
      message: 'In te spera verunt',
      owner_id: 'Belle',
      expiration: 'N/A',
    },
    {
      _id: 'three_id',
      message: 'patre nostris',
      owner_id: 'Genie',
      expiration: 'N/A',
    }
  ];

  constructor() {
    super(null);
  }
  // should be tested in the doorboard component spec
  getNotes(filters: { owner_id?: string }): Observable<Note[]> {
    return of(MockNoteService.testNotes);
  }

}
