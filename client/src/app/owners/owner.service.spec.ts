// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Owner } from './owner';
// import { OwnerService } from './owner.service';

// describe('Owner service: ', () => {
//   // A small collection of test owners
//   const testOwners: Owner[] = [
//     {
//       _id: 'chris_id',
//       name: 'Chris',
//       age: 25,
//       company: 'UMM',
//       email: 'chris@this.that',
//       role: 'admin',
//       avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon'
//     },
//     {
//       _id: 'pat_id',
//       name: 'Pat',
//       age: 37,
//       company: 'IBM',
//       email: 'pat@something.com',
//       role: 'editor',
//       avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon'
//     },
//     {
//       _id: 'jamie_id',
//       name: 'Jamie',
//       age: 37,
//       company: 'Frogs, Inc.',
//       email: 'jamie@frogs.com',
//       role: 'viewer',
//       avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon'
//     }
//   ];
//   let ownerService: OwnerService;
//   // These are used to mock the HTTP requests so that we (a) don't have to
//   // have the server running and (b) we can check exactly which HTTP
//   // requests were made to ensure that we're making the correct requests.
//   let httpClient: HttpClient;
//   let httpTestingController: HttpTestingController;

//   beforeEach(() => {
//     // Set up the mock handling of the HTTP requests
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule]
//     });
//     httpClient = TestBed.inject(HttpClient);
//     httpTestingController = TestBed.inject(HttpTestingController);
//     // Construct an instance of the service with the mock
//     // HTTP client.
//     ownerService = new OwnerService(httpClient);
//   });

//   afterEach(() => {
//     // After every test, assert that there are no more pending requests.
//     httpTestingController.verify();
//   });

//   it('getOwners() calls api/owners', () => {
//     // Assert that the owners we get from this call to getOwners()
//     // should be our set of test owners. Because we're subscribing
//     // to the result of getOwners(), this won't actually get
//     // checked until the mocked HTTP request 'returns' a response.
//     // This happens when we call req.flush(testOwners) a few lines
//     // down.
//     ownerService.getOwners().subscribe(
//       owners => expect(owners).toBe(testOwners)
//     );

//     // Specify that (exactly) one request will be made to the specified URL.
//     const req = httpTestingController.expectOne(ownerService.ownerUrl);
//     // Check that the request made to that URL was a GET request.
//     expect(req.request.method).toEqual('GET');
//     // Specify the content of the response to that request. This
//     // triggers the subscribe above, which leads to that check
//     // actually being performed.
//     req.flush(testOwners);
//   });

//   it('getOwners() calls api/owners with filter parameter \'admin\'', () => {

//     ownerService.getOwners({ role: 'admin' }).subscribe(
//       owners => expect(owners).toBe(testOwners)
//     );

//     // Specify that (exactly) one request will be made to the specified URL with the role parameter.
//     const req = httpTestingController.expectOne(
//       (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('role')
//     );

//     // Check that the request made to that URL was a GET request.
//     expect(req.request.method).toEqual('GET');

//     // Check that the role parameter was 'admin'
//     expect(req.request.params.get('role')).toEqual('admin');

//     req.flush(testOwners);
//   });

//   it('getOwners() calls api/owners with filter parameter \'age\'', () => {

//     ownerService.getOwners({ age: 25 }).subscribe(
//       owners => expect(owners).toBe(testOwners)
//     );

//     // Specify that (exactly) one request will be made to the specified URL with the role parameter.
//     const req = httpTestingController.expectOne(
//       (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('age')
//     );

//     // Check that the request made to that URL was a GET request.
//     expect(req.request.method).toEqual('GET');

//     // Check that the role parameter was 'admin'
//     expect(req.request.params.get('age')).toEqual('25');

//     req.flush(testOwners);
//   });

//   it('getOwners() calls api/owners with multiple filter parameters', () => {

//     ownerService.getOwners({ role: 'editor', company: 'IBM', age: 37 }).subscribe(
//       owners => expect(owners).toBe(testOwners)
//     );

//     // Specify that (exactly) one request will be made to the specified URL with the role parameter.
//     const req = httpTestingController.expectOne(
//       (request) => request.url.startsWith(ownerService.ownerUrl)
//         && request.params.has('role') && request.params.has('company') && request.params.has('age')
//     );

//     // Check that the request made to that URL was a GET request.
//     expect(req.request.method).toEqual('GET');

//     // Check that the role parameters are correct
//     expect(req.request.params.get('role')).toEqual('editor');
//     expect(req.request.params.get('company')).toEqual('IBM');
//     expect(req.request.params.get('age')).toEqual('37');

//     req.flush(testOwners);
//   });

//   it('getOwnerById() calls api/owners/id', () => {
//     const targetOwner: Owner = testOwners[1];
//     const targetId: string = targetOwner._id;
//     ownerService.getOwnerById(targetId).subscribe(
//       owner => expect(owner).toBe(targetOwner)
//     );

//     const expectedUrl: string = ownerService.ownerUrl + '/' + targetId;
//     const req = httpTestingController.expectOne(expectedUrl);
//     expect(req.request.method).toEqual('GET');
//     req.flush(targetOwner);
//   });

//   it('filterOwners() filters by name', () => {
//     expect(testOwners.length).toBe(3);
//     const ownerName = 'a';
//     expect(ownerService.filterOwners(testOwners, { name: ownerName }).length).toBe(2);
//   });

//   it('filterOwners() filters by company', () => {
//     expect(testOwners.length).toBe(3);
//     const ownerCompany = 'UMM';
//     expect(ownerService.filterOwners(testOwners, { company: ownerCompany }).length).toBe(1);
//   });

//   it('filterOwners() filters by name and company', () => {
//     expect(testOwners.length).toBe(3);
//     const ownerCompany = 'UMM';
//     const ownerName = 'chris';
//     expect(ownerService.filterOwners(testOwners, { name: ownerName, company: ownerCompany }).length).toBe(1);
//   });

//   it('addOwner() calls api/owners/new', () => {

//     ownerService.addOwner(testOwners[1]).subscribe(
//       id => expect(id).toBe('testid')
//     );

//     const req = httpTestingController.expectOne(ownerService.ownerUrl + '/new');

//     expect(req.request.method).toEqual('POST');
//     expect(req.request.body).toEqual(testOwners[1]);

//     req.flush({id: 'testid'});
//   });
// });
