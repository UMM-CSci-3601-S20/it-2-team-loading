// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';
// import { ActivatedRoute } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRouteStub } from '../../testing/activated-route-stub';
// import { MockOwnerService } from '../../testing/owner.service.mock';
// import { Owner } from './owner';
// import { OwnerCardComponent } from './owner-card.component';
// import { OwnerProfileComponent } from './owner-profile.component';
// import { OwnerService } from './owner.service';

// describe('OwnerProfileComponent', () => {
//   let component: OwnerProfileComponent;
//   let fixture: ComponentFixture<OwnerProfileComponent>;
//   const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         MatCardModule
//       ],
//       declarations: [OwnerProfileComponent, OwnerCardComponent],
//       providers: [
//         { provide: OwnerService, useValue: new MockOwnerService() },
//         { provide: ActivatedRoute, useValue: activatedRoute }
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(OwnerProfileComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should navigate to a specific owner profile', () => {
//     const expectedOwner: Owner = MockOwnerService.testOwners[0];
//     // Setting this should cause anyone subscribing to the paramMap
//     // to update. Our `OwnerProfileComponent` subscribes to that, so
//     // it should update right away.
//     activatedRoute.setParamMap({ id: expectedOwner._id });

//     expect(component.id).toEqual(expectedOwner._id);
//     expect(component.owner).toEqual(expectedOwner);
//   });

//   it('should navigate to correct owner when the id parameter changes', () => {
//     let expectedOwner: Owner = MockOwnerService.testOwners[0];
//     // Setting this should cause anyone subscribing to the paramMap
//     // to update. Our `OwnerProfileComponent` subscribes to that, so
//     // it should update right away.
//     activatedRoute.setParamMap({ id: expectedOwner._id });

//     expect(component.id).toEqual(expectedOwner._id);

//     // Changing the paramMap should update the displayed owner profile.
//     expectedOwner = MockOwnerService.testOwners[1];
//     activatedRoute.setParamMap({ id: expectedOwner._id });

//     expect(component.id).toEqual(expectedOwner._id);
//   });

//   it('should have `null` for the owner for a bad ID', () => {
//     activatedRoute.setParamMap({ id: 'badID' });

//     // If the given ID doesn't map to a owner, we expect the service
//     // to return `null`, so we would expect the component's owner
//     // to also be `null`.
//     expect(component.id).toEqual('badID');
//     expect(component.owner).toBeNull();
//   });
// });
