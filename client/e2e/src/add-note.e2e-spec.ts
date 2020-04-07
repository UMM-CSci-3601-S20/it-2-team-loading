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

  it('Should add a new note and go to the right page', async () => {
    const note: TestNote = {
      owner_id: E2EUtil.randomText(14),
      message: E2EUtil.randomLetters(10),
      owner: E2EUtil.randomText(10),
    };

    await page.addNote(note);

    // Wait until the URL does not contain 'notes/new
    await browser.wait(EC.not(EC.urlContains('notes/new')), 10000);

    const url = await page.getUrl();
    expect(RegExp('/owner/78f1d3bfa098879fe7a01373/notes').test(url)).toBe(true);
    expect(url.endsWith('/notes/new')).toBe(false);
  });

});
