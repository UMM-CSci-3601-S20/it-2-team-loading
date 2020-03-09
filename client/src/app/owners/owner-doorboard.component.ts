import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
export class OwnerDoorBoardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private ownerService: OwnerService) { }
  owner: Owner;
  id: string;
  getOwnerSub: Subscription;
  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested owner.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getOwnerSub) {
        this.getOwnerSub.unsubscribe();
      }
      this.getOwnerSub = this.ownerService.getOwnerById(this.id).subscribe(owner => this.owner = owner);
      // this.getPostsSub = this.postService.getPosts({ owner: this.owner.name }).subscribe(posts => this.posts = posts);
    });
  }

  ngOnDestroy(): void {
    if (this.getOwnerSub) {
      this.getOwnerSub.unsubscribe();
    }
  }

}
