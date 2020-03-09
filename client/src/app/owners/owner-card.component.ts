import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Owner } from './owner';
import { PostService } from '../posts/post.service';
import { Post } from '../posts/post';
import { Subscription } from 'rxjs';
import { PostListComponent } from '.././posts/post-list.component';

@Component({
  selector: 'app-owner-card',
  templateUrl: './owner-card.component.html',
  styleUrls: ['./owner-card.component.scss']
})
export class OwnerCardComponent implements OnInit, OnDestroy {
  // I'm hoping to mimic the functionality fo the owner-doorboard.ts file but for posts
  // while also taking in the owner value said function provides to this component for filtration by owner name
  @Input() owner: Owner;
  @Input() simple ? = false;
  posts: Post[];
  constructor(private postService: PostService) { }
  getPostsSub: Subscription;
  ngOnInit(): void {
    this.getPostsSub = this.postService.getPosts({ owner: this.owner.name })
    .subscribe(posts => this.posts = posts);
  }
  ngOnDestroy(): void {
    if (this.getPostsSub) {
      this.getPostsSub.unsubscribe();
    }
  }

}
