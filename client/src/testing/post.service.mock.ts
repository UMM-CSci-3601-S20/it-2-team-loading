import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../app/posts/post';
import { PostService } from '../app/posts/post.service';
//import { Owner } from '../app/owners/owner';

/**
 * A "mock" version of the `PostService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockPostService extends PostService {
  static testPosts: Post[] = [
    {
      _id: 'one_id',
      message: 'Spirate pur, Spirate',
      //owner:
    },
    {
      _id: 'two_id',
      message: 'In te spera verunt',
      //owner:
    },
    {
      _id: 'three_id',
      message: 'patre nostris',
      //owner:
    }
  ];

  constructor() {
    super(null);
  }

  getPosts(filters: { message?: string, /*owner?: Owner*/ }): Observable<Post[]> {
    // Just return the test posts regardless of what filters are passed in
    return of(MockPostService.testPosts);
  }

  getPostById(id: string): Observable<Post> {
    // If the specified ID is for the first test post,
    // return that post, otherwise return `null` so
    // we can test illegal post requests.
    if (id === MockPostService.testPosts[0]._id) {
      return of(MockPostService.testPosts[0]);
    } else {
      return of(null);
    }
  }

}
