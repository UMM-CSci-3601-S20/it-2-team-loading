import {browser, by, element, Key, ElementFinder} from 'protractor';

export class DoorBoard {
  // navigates to Rachel Johnson's doorboard
  navigateTo() {
    return browser.get('/owner/588935f57546a2daea44de7c/posts');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getPageTitle() {
    const title = element(by.className('owner-card')).getText();
    return title;
  }

  getOwnerListItems() {
    return element(by.className('list-of-owner-posts')).all(by.className('list-of-posts'));
  }
}
