import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Owner } from './owner';
import { OwnerService } from './owner.service';

describe('Owner service: ', () => {
  // A small collection of test owners
  const testOwners: Owner[] = [
    {
      _id: 'testman_id',
      name: 'Test Man',
      officeID: '3168',
      email: 'tman@gmail.com',
      building: 'Testing'
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
    {
      _id: 'alien_id',
      name: 'Alien',
      officeID: '9999',
      email: 'definitelyfriendly@outerspace.com',
      building: 'The moon'
    },
  ];
  let ownerService: OwnerService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    ownerService = new OwnerService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getOwners() calls api/owners', () => {
    // Assert that the owners we get from this call to getOwners()
    // should be our set of test owners. Because we're subscribing
    // to the result of getOwners(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testOwners) a few lines
    // down.
    ownerService.getOwners().subscribe(
      owners => expect(owners).toBe(testOwners)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(ownerService.ownerUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testOwners);
  });

  it('getOwnerById() calls api/owners/:id', () => {
    const targetOwner: Owner = testOwners[1];
    const targetId: string = targetOwner._id;
    ownerService.getOwnerById(targetId).subscribe(
      owner => expect(owner).toBe(targetOwner)
    );

    const expectedUrl: string = ownerService.ownerUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetOwner);
  });

  it('getOwners() calls api/owners with filter parameter \'name\'', () => {

    ownerService.getOwners({ name: 'Cow Tipper' }).subscribe(
      owners => expect(owners).toBe(testOwners)
    );

    // Specify that (exactly) one request will be made to the specified URL with the name parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('name')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the owner returned is 'Cow Tipper'
    expect(req.request.params.get('name')).toEqual('Cow Tipper');

    req.flush(testOwners);
  });

  it('getOwners() calls api/owners with filter parameter \'officeID\'', () => {

    ownerService.getOwners({ officeID: '9999' }).subscribe(
      owners => expect(owners).toBe(testOwners)
    );

    // Specify that (exactly) one request will be made to the specified URL with the officeID parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('officeID')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'officeID'
    expect(req.request.params.get('officeID')).toEqual('9999');

    req.flush(testOwners);
  });

  it('getOwners() calls api/owners with filter parameter \'building\'', () => {

    ownerService.getOwners({ building: 'Some pasture' }).subscribe(
      owners => expect(owners).toBe(testOwners)
    );

    // Specify that (exactly) one request will be made to the specified URL with the officeID parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('building')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'officeID'
    expect(req.request.params.get('building')).toEqual('Some pasture');

    req.flush(testOwners);
  });

  it('getOwners() calls api/owners with multiple filter parameters', () => {
    ownerService.getOwners({ name: 'Alien', building: 'The moon', officeID: '9999' }).subscribe(
      owners => expect(owners).toBe(testOwners)
    );

    // Specify that exactly one request will be made to the specified URL with these parameters.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(ownerService.ownerUrl) && request.params.has('name')
        && request.params.has('officeID')
        && request.params.has('building')
    );
    // Should be a GET request
    expect(req.request.method).toEqual('GET');

    // Should have expected parameters
    expect(req.request.params.get('name')).toEqual('Alien');
    expect(req.request.params.get('officeID')).toEqual('9999');
    expect(req.request.params.get('building')).toEqual('The moon');

    req.flush(testOwners);
  });

  it('getOwnerById() calls api/owners/id', () => {
    // grab an owner from our test array
    const targetOwner: Owner = testOwners[0];
    // pull the id from that owner
    const targetId: string = targetOwner._id;
    // get that owner from the server and check that you got the right one
    ownerService.getOwnerById(targetId).subscribe(
      owner => expect(owner).toBe(targetOwner)
    );

    const expectedUrl: string = ownerService.ownerUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    // should be a GET request
    expect(req.request.method).toEqual('GET');
    req.flush(targetOwner);
  });

  it('addOwner() calls api/owners/new', () => {

    ownerService.addOwner(testOwners[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(ownerService.ownerUrl + '/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testOwners[1]);

    req.flush({ id: 'testid' });
  });

});
