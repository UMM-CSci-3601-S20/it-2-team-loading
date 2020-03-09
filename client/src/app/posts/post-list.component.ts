import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Post} from './post';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list-component',
  templateUrl: 'post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: []
})

export class PostListComponent implements OnInit, OnDestroy  {
  // I just have this here because I don't always want to display the filter by owner box displayed.
  @Input() simple ? = true;
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredPosts: Post[];
  public filteredPosts: Post[];

  public postOwner: string;

  public postNote: string;
  getPostsSub: Subscription;

  // Inject the PostService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private postService: PostService) {

  }

  getPostsFromServer(): void {
    this.unsub();
    this.getPostsSub = this.postService.getPosts({
      owner: this.postOwner // this is currently just the owner name, will want to use unique ID in future
    }).subscribe(returnedPosts => {
      this.serverFilteredPosts = returnedPosts;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredPosts = this.postService.filterPosts(
      this.serverFilteredPosts, {});
  }

  /**
   * Starts an asynchronous operation to update the posts list
   *
   */
  ngOnInit(): void {
    this.getPostsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getPostsSub) {
      this.getPostsSub.unsubscribe();
    }
  }
}
