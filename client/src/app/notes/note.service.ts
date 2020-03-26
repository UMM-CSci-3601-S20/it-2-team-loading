import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note } from './note';
import { map } from 'rxjs/operators';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';
  readonly ownerUrl: string = environment.API_URL + 'owner';

  constructor(private httpClient: HttpClient) {
  }

  // this will get passed the owner id and display all the messages from that owner
  // maybe this needs to be formatted like getNotes where we return with params:httpParams?
  // currently this doesn't filter anything. It just displays all the notes.

  getOwnerNotes(filters?: { owner_id?: string}): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters.owner_id) {
      httpParams = httpParams.set('owner_id', filters.owner_id);
    }
    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  addNote(id: string, newNote: Note): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>
    (this.ownerUrl + '/' + id  + '/notes/new', newNote).pipe(map(res => res.id));
  }

  getTimestamp(): string {
    // Create a date object with the current time
    let now: Date = new Date();
    // Create an array with the current month, day and time
    let date: Array<String> = [ String(now.getMonth() + 1), String(now.getDay()), String(now.getFullYear()) ];
    // Create an array with the current hour, minute and second
    let time: Array<String> = [ String(now.getHours()), String(now.getMinutes()), String(now.getSeconds())];
    // Return the formatted string
    return date.join("/"),
           time.join(":")
  }
}
