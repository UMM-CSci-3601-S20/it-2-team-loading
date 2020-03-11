import { Component, OnInit, OnDestroy, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Owner } from './owner';
import { OwnerService } from './owner.service';
import { Subscription } from 'rxjs';
import { PostService } from '.././posts/post.service';
import { Post } from '.././posts/post';

@Component({
  selector: 'app-owner-doorboard',
  templateUrl: './owner-doorboard.component.html',
  styleUrls: ['./owner-doorboard.component.scss']
})

// This class has access to the owner of the doorboard, and all the posts that said owner has made
export class OwnerDoorBoardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private postService: PostService,
              private ownerService: OwnerService) { }
  posts: Post[];
  owner: Owner;
  id: string;
  getPostsSub: Subscription;
  getOwnerSub: Subscription;
  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested owner.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.getPostsSub = this.postService.getOwnerPosts({ owner_id: this.id }).subscribe(posts => this.posts = posts);
      this.getOwnerSub = this.ownerService.getOwnerById(this.id).subscribe(owner => this.owner = owner);
    });
  }

  ngOnDestroy(): void {
    if (this.getPostsSub) {
      this.getPostsSub.unsubscribe();
    }
  }

}
