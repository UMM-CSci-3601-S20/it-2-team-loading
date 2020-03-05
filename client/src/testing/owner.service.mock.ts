import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Owner } from '../app/owners/owner';
import { OwnerService } from '../app/owners/owner.service';

/**
 * A "mock" version of the `OwnerService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockOwnerService extends OwnerService {
  static testOwners: Owner[] = [
    {
      _id: 'rachaeljohnson_id',
      name: 'Rachael Johnson',
      officeID: '1310',
      email: 'rmjohns@morris.umn.edu',
      building: 'Science'
    },
    {
      _id: 'indrajitchaudhury_id',
      name: 'Indrajit Chaudhury',
      officeID: '1375',
      email: 'chaud072@morris.umn.edu',
      building: 'Science'
    },
    {
      _id: 'robertdenton_id',
      name: 'Robert Denton',
      officeID: '2065',
      email: 'rdenton@morris.umn.edu',
      building: 'Science'
    },
    {
      _id: 'spaceman_id',
      name: 'Space Man',
      officeID: '9999',
      email: 'moonrocks@hotmail.com',
      building: 'The moon'
    },
    {
      _id: 'cowtipper_id',
      name: 'Cow Tipper',
      officeID: '4512',
      email: 'fiendofthebovine@gmail.com',
      building: 'Some pasture'
    },
  ];

  constructor() {
    super(null);
  }
  // no filters here yet, don't know what we want to have the database filter for us
  getOwners(filters: {  }): Observable<Owner[]> {
    // Just return the test owners regardless of what filters are passed in
    return of(MockOwnerService.testOwners);
  }

  getOwnerById(id: string): Observable<Owner> {
    // If the specified ID is for the first test owner,
    // return that owner, otherwise return `null` so
    // we can test illegal owner requests.
    if (id === MockOwnerService.testOwners[0]._id) {
      return of(MockOwnerService.testOwners[0]);
    } else {
      return of(null);
    }
  }

}
