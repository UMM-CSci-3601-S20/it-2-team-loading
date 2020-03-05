import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockPostService } from '../../testing/post.service.mock';
import { Post } from './post';
import { PostListComponent } from './post-list.component';
import { PostService } from './post.service';
import { MatIconModule } from '@angular/material/icon';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];


/* These still need to be changed commenting
describe('Post list', () => {

  let postList: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [PostListComponent],
      // providers:    [ PostService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: PostService, useValue: new MockPostService() }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PostListComponent);
      postList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the posts', () => {
    expect(postList.serverFilteredPosts.length).toBe(3);
  });

  it('contains a post Noted \'Chris\'', () => {
    expect(postList.serverFilteredPosts.some((post: Post) => post.Note === 'Chris')).toBe(true);
  });

  it('contain a post Noted \'Jamie\'', () => {
    expect(postList.serverFilteredPosts.some((post: Post) => post.Note === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a post Noted \'Santa\'', () => {
    expect(postList.serverFilteredPosts.some((post: Post) => post.note === 'Santa')).toBe(false);
  });

  it('has two posts that are 37 years old', () => {
    expect(postList.serverFilteredPosts.filter((post: Post) => post.age === 37).length).toBe(2);
  });
});
*/

describe('Misbehaving Post List', () => {
  let postList: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;

  let postServiceStub: {
    getPosts: () => Observable<Post[]>;
    getPostsFiltered: () => Observable<Post[]>;
  };

  beforeEach(() => {
    // stub PostService for test purposes
    postServiceStub = {
      getPosts: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getPostsFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [PostListComponent],
      // providers:    [ PostService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: PostService, useValue: postServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PostListComponent);
      postList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


  /* Commenting out tests for now
  it('generates an error if we don\'t set up a PostListService', () => {
    // Since the observer throws an error, we don't expect posts to be defined.
    expect(postList.serverFilteredPosts).toBeUndefined();
  });
  */
});
