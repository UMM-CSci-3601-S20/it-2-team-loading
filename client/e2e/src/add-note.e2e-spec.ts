import {browser, protractor, by, element, utils} from 'protractor';
import { AddNotePage, TestNote } from './add-note.po';
import { E2EUtil } from './e2e.util';

describe('Add note', () => {
  let page: AddNotePage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddNotePage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTitle()).toEqual('New Note');
  });


  it('Should enable and disable the add note button', async () => {
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.typeInput('messageField', 'bit.ly/umm-cscc');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(true);
  });

});
