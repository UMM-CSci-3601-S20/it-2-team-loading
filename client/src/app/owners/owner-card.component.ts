import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Owner } from './owner';
import { PostService } from '../posts/post.service';
import { Post } from '../posts/post';
import { Subscription } from 'rxjs';
// import { PostListComponent } from '.././posts/post-list.component';

@Component({
  selector: 'app-owner-card',
  templateUrl: './owner-card.component.html',
  styleUrls: ['./owner-card.component.scss']
})
export class OwnerCardComponent implements OnInit, OnDestroy {
  @Input() owner: Owner;
  @Input() simple ? = false;
  constructor() { }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

}
