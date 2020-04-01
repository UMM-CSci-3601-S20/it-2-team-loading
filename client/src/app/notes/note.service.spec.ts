import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Note } from './note';
import { NoteService } from './note.service';
import { request } from 'http';

describe('Note service: ', () => {
  const testNotes: Note[] = [
    {
      _id: '401965892d4c0b6138467f51',
      owner_id: '588935f57546a2daea44de7c',
      message: 'I\'m going to be a few minutes late to my office hours today. I got caught in traffic this morning.',
      timestamp: 'new Date()',
    },
    {
      _id: '588935f57546a2daea44de7d',
      owner_id: '588935f57546a2daea44de7c',
      message: 'Never mind, it seems like traffic is worse than I expected. Office hours will be moved up a half hour.',
      timestamp: 'new Date()',
    },
    {
      _id: '588935f57346a2daea44de7f',
      owner_id: '588935f57546a2daea44de7e',
      message: 'Office hours are canceled today!',
      timestamp: 'new Date()',
    },
    {
      _id: '588935f57446a2daea44de7d',
      owner_id: '78f1d3bfa098879fe7a01373',
      message: 'Just getting into the building now, sorry for the delay!',
      timestamp: 'new Date()',
    },
  ];
  let noteService: NoteService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    noteService = new NoteService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // gets notes by calling api/notes
  it('getOwnerNotes() calls api/notes', () => {
    noteService.getOwnerNotes({ owner_id: '588935f57546a2daea44de7c' }).subscribe(
      notes => expect(notes).toEqual(testNotes)
    );
    // not sure about this test
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(noteService.noteUrl) && request.params.has('owner_id')
    );

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('owner_id')).toEqual('588935f57546a2daea44de7c');
    // expect(req.request.params.get('timestamp') != null).toBeTrue();
    expect(req.request.params.get('timestamp')).toEqual('new Date()');
    req.flush(testNotes);
  });

  it('getNoteById() calls api/notes/id', () => {
  it('addNote() calls api/owner/:id/notes/new', () => {
    // addNote takes in an owner_id and a Note type and returns
    noteService.addNote('588935f57546a2daea44de7c', testNotes[1]).subscribe(
      id => expect(id).toBe('588935f57546a2daea44de7c')
    );

    const req = httpTestingController.expectOne(noteService.ownerUrl + '/' + '588935f57546a2daea44de7c' + '/notes/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testNotes[1]);

    req.flush({ id: '588935f57546a2daea44de7c' });
  });

});
