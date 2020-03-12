import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from './post';
import { map } from 'rxjs/operators';
// import { Owner } from '../owners/owner';

@Injectable()
export class PostService {
  readonly postUrl: string = environment.API_URL + 'posts';
  readonly ownerUrl: string = environment.API_URL + 'owner';

  constructor(private httpClient: HttpClient) {
  }

  // this will get passed the owner id and display all the messages from that owner
  // maybe this needs to be formatted like getPosts where we return with params:httpParams?
  // currently this doesn't filter anything. It just displays all the posts.
  getOwnerPosts(filters?: { owner_id?: string}): Observable<Post[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters.owner_id) {
      httpParams = httpParams.set('owner_id', filters.owner_id);
    }
    return this.httpClient.get<Post[]>(this.postUrl, {
      params: httpParams,
    });
  }

  addPost(id: string, newPost: Post): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>
    (this.ownerUrl + '/' + id  + '/posts/new', newPost).pipe(map(res => res.id));
  }
}
