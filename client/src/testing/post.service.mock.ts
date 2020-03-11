import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../app/posts/post';
import { PostService } from '../app/posts/post.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
// import { Owner } from '../app/owners/owner';


/**
 * A "mock" version of the `PostService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockPostService extends PostService {
  /*static aladdin: Owner = {
      _id: 'aladdin_id',
      name: 'Aladdin',
      officeID: '902',
      email: 'orphan@33.com',
      building: 'taj mahal'
  };
  static belle: Owner = {
      _id: 'belle_id',
      name: 'Belle',
      officeID: '1740',
      email: 'fatface@mfbook.com',
      building: 'beast castle'
  };
  static genie: Owner = {
      _id: 'genie_id',
      name: 'Genie',
      officeID: '10000',
      email: 'youtalkin@tome.com',
      building: 'the lamp'
  };*/
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

  getPosts(filters: { message?: string, owner?: string }): Observable<Post[]> {
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
