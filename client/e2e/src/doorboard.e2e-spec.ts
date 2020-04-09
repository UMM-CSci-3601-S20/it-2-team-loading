import {DoorBoard} from './doorboard.po';
import { protractor, by, element, Button } from 'protractor';

describe('Owner Doorboard', () => {
  let page: DoorBoard;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new DoorBoard();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getPageTitle()).toEqual('TestOwner');
  });
  // it('Should have correct last note', async () => {
  //  page.getNoteCards().last();
  //  expect(element(by.className('message')).getText()).toEqual(
  //   'This is a test Note');
  // });



  });
