import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from './post';
import { map } from 'rxjs/operators';
import { Owner } from '../owners/owner';

@Injectable()
export class PostService {
  readonly postUrl: string = environment.API_URL + 'posts';

  constructor(private httpClient: HttpClient) {
  }

  getPosts(filters?: { message?: string, owner?: Owner }): Observable<Post[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.message) {
        httpParams = httpParams.set('message', filters.message);
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner.toString());
      }
    }
    return this.httpClient.get<Post[]>(this.postUrl, {
      params: httpParams,
    });
  }

  getPostById(id: string): Observable<Post> {
    return this.httpClient.get<Post>(this.postUrl + '/' + id);
  }

  filterPosts(posts: Post[], filters: { message?: string, owner?: Owner }): Post[] {

    let filteredPosts = posts;

    // Filter by message
    if (filters.message) {
      filters.message = filters.message.toLowerCase();

      filteredPosts = filteredPosts.filter(post => {
        return post.message.toLowerCase().indexOf(filters.message) !== -1;
      });
    }

    return filteredPosts;
  }

  addPost(newPost: Post): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.postUrl + '/new', newPost).pipe(map(res => res.id));
  }
}
