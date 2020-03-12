import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Owner } from './owner';

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
