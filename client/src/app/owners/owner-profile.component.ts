import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Owner } from './owner';
import { OwnerService } from './owner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.scss']
})
export class OwnerProfileComponent implements OnInit, OnDestroy {

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
    });
  }

  ngOnDestroy(): void {
    if (this.getOwnerSub) {
      this.getOwnerSub.unsubscribe();
    }
  }

}
