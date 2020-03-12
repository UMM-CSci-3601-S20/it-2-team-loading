import {DoorBoard} from './doorboard.po';
import {browser, protractor, by, element} from 'protractor';

describe('Owner Doorboard', () => {
  let page: DoorBoard;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new DoorBoard();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getPageTitle()).toEqual('Rachael Johnson');
  });

});

