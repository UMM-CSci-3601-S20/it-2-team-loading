import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Owner } from './owner';
import { map } from 'rxjs/operators';

@Injectable()
export class OwnerService {
  readonly ownerUrl: string = environment.API_URL + 'owners';

  constructor(private httpClient: HttpClient) {
  }
  // commented out filters for now as we haven't decided where we will filter things
  // and currently all filtering is handled by Angular
  getOwners(filters?: {}): Observable<Owner[]> {
    let httpParams: HttpParams = new HttpParams();
    // if (filters) {
    //   if (filters.role) {
    //     httpParams = httpParams.set('role', filters.role);
    //   }
    //   if (filters.age) {
    //     httpParams = httpParams.set('age', filters.age.toString());
    //   }
    //   if (filters.officeID) {
    //     httpParams = httpParams.set('officeID', filters.officeID);
    //   }
    // }
    return this.httpClient.get<Owner[]>(this.ownerUrl, {
      params: httpParams,
    });
  }

  getOwnerById(id: string): Observable<Owner> {
    return this.httpClient.get<Owner>(this.ownerUrl + '/' + id);
  }

  filterOwners(owners: Owner[], filters: { name?: string, officeID?: string, building?: string }): Owner[] {

    let filteredOwners = owners;

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.name.toLowerCase().indexOf(filters.name) !== -1;
      });
    }

    // Filter by officeID
    if (filters.officeID) {
      filters.officeID = filters.officeID.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.officeID.toLowerCase().indexOf(filters.officeID) !== -1;
      });
    }

    // Filter by building
    if (filters.building) {
      filters.building = filters.building.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.building.toLowerCase().indexOf(filters.building) !== -1;
      });
    }

    return filteredOwners;
  }

  addOwner(newOwner: Owner): Observable<string> {
    // Send post request to add a new owner with the owner data as the body.
    return this.httpClient.post<{ id: string }>(this.ownerUrl + '/new', newOwner).pipe(map(res => res.id));
  }
}
