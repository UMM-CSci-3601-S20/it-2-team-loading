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

  it('Should have the correct first post', async () => {
    page.getOwnerListItems().first();
    expect(element(by.className('post-card')).getText()).toEqual(
    'Never mind, it seems like traffic is worse than I expected. Office hours will be moved up a half hour.');
    });
  });
