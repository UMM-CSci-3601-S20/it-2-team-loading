import {DoorBoard} from './doorboard.po';
import { protractor, by, element } from 'protractor';

describe('Owner Doorboard', () => {
  let page: DoorBoard;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new DoorBoard();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getPageTitle()).toEqual('Rachel Johnson');
  });


 /*   // This test needs to be re-written to get the correct note
  it('Should have the correct first note', async () => {
    page.getOwnerListItems().first();
    expect(element(by.className('message')).getText()).toEqual(
      'I\'m going to be a few minutes late to my office hours today. I got caught in traffic this morning.');
  });
  */
  });

