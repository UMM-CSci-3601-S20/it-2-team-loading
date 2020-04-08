import {browser, by, element} from 'protractor';

export class DoorBoard {
  // navigates to Rachel Johnson's doorboard
  navigateTo() {
    return browser.get('/owner/588935f57546a2daea44de7c/notes');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getPageTitle() {
    const title = element(by.className('owner-card')).getText();
    return title;
  }

  getOwnerListItems() {
    return element(by.className('note-cards-container')).all(by.className('note-cards-container'));
  }
}
