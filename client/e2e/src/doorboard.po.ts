import {browser, by, element, Key, ElementFinder} from 'protractor';

export class DoorBoard {
  // navigates to Rachel Johnson's doorboard
  navigateTo() {
    return browser.get('/owner/5e7cf9ac7d640633c9256b90/notes');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getPageTitle() {
    const title = element(by.className('owner-card')).getText();
    return title;
  }
  getNoteCards() {
    return element(by.className('note-cards-container')).all(by.tagName('app-note-card'));
  }

}
