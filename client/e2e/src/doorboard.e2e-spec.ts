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
    expect(page.getPageTitle()).toEqual('Rachael Johnson');
  });

  it('Should have the correct first post', async() => {
    page.getOwnerListItems().first();
    expect(element(by.className('post-card')).getText()).toEqual(
      'I\'m going to be a few minutes late to my office hours today. I got caught in traffic this morning.');
  });
  });

