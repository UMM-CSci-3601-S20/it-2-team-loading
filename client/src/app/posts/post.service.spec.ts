import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Post } from './post';
import { PostService } from './post.service';
import { MockPostService } from 'src/testing/post.service.mock';

describe('Post service: ', () => {
  const testPosts: Post[] = [
    {
      _id: '401965892d4c0b6138467f51',
      owner_id: '588935f57546a2daea44de7c',
      message: 'I\'m going to be a few minutes late to my office hours today. I got caught in traffic this morning.'
    },
    {
      _id: '588935f57546a2daea44de7d',
      owner_id: '588935f57546a2daea44de7c',
      message: 'Never mind, it seems like traffic is worse than I expected. Office hours will be moved up a half hour.'
    },
    {
      _id: '588935f57346a2daea44de7f',
      owner_id: '588935f57546a2daea44de7e',
      message: 'Office hours are canceled today!'
    },
    {
      _id: '588935f57446a2daea44de7d',
      owner_id: '78f1d3bfa098879fe7a01373',
      message: 'Just getting into the building now, sorry for the delay!'
    },
  ];
  let postService: PostService;
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
    postService = new PostService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getOwnerPosts() calls api/owner/:id/posts', () => {
    postService.getOwnerPosts({ owner_id: '588935f57546a2daea44de7c' }).subscribe(
      posts => expect(posts).toBe(testPosts)
    );
    // not sure about this test
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(postService.postUrl) && request.params.has('owner_id')
    );
  });
  it('addPost() calls api/owner/:id/posts/new', () => {
    // addPost takes in an owner_id and a Post type and returns
    postService.addPost('588935f57546a2daea44de7c', testPosts[1]).subscribe(
      id => expect(id).toBe('588935f57546a2daea44de7c')
    );

    const req = httpTestingController.expectOne(postService.ownerUrl + '/' + '588935f57546a2daea44de7c' + '/posts/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testPosts[1]);

    req.flush({ id: '588935f57546a2daea44de7c' });
  });
});
