import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../app/posts/post';
import { PostService } from '../app/posts/post.service';


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
      owner_id: 'Aladdin'
    },
    {
      _id: 'two_id',
      message: 'In te spera verunt',
      owner_id: 'Belle'
    },
    {
      _id: 'three_id',
      message: 'patre nostris',
      owner_id: 'Genie'
    }
  ];

  constructor() {
    super(null);
  }
  // should be tested in the doorboard component spec
  getOwnerPosts(filters: { owner_id?: string }): Observable<Post[]> {
    return of(MockPostService.testPosts);
  }

}
