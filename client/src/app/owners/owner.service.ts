import { HttpClient, HttpParams } from '@angular/common/http';
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
  // Planning on just filtering everything from the database so that there won't be as much strain on user phones
  getOwners(filters?: { name?: string, officeID?: string, building?: string}): Observable<Owner[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.name) {
        httpParams = httpParams.set('name', filters.name);
      }
      if (filters.officeID) {
        httpParams = httpParams.set('officeID', filters.officeID);
      }
      if (filters.building) {
        httpParams = httpParams.set('building', filters.building);
      }
    }
    return this.httpClient.get<Owner[]>(this.ownerUrl, {
      params: httpParams,
    });
  }

  getOwnerById(id: string): Observable<Owner> {
    return this.httpClient.get<Owner>(this.ownerUrl + '/' + id);
  }

  filterOwners(owners: Owner[], filters: {  }): Owner[] {

    const filteredOwners = owners;
    return filteredOwners;
  }

  addOwner(newOwner: Owner): Observable<string> {
    // Send post request to add a new owner with the owner data as the body.
    return this.httpClient.post<{ id: string }>(this.ownerUrl + '/new', newOwner).pipe(map(res => res.id));
  }
}
