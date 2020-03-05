// import {browser, by, element, Key, ElementFinder} from 'protractor';

// export class OwnerPage {
//   navigateTo() {
//     return browser.get('/owners');
//   }

//   getUrl() {
//     return browser.getCurrentUrl();
//   }

//   getOwnerTitle() {
//     const title = element(by.className('owner-list-title')).getText();
//     return title;
//   }

//   async typeInput(inputId: string, text: string) {
//     const input = element(by.id(inputId));
//     await input.click();
//     await input.sendKeys(text);
//   }

//   selectMatSelectValue(selectID: string, value: string) {
//     const sel = element(by.id(selectID));
//     return sel.click().then(() => {
//       return element(by.css('mat-option[value="' + value + '"]')).click();
//     });
//   }

//   getOwnerCards() {
//     return element(by.className('owner-cards-container')).all(by.tagName('app-owner-card'));
//   }

//   getOwnerListItems() {
//     return element(by.className('owner-nav-list')).all(by.className('owner-list-item'));
//   }

//   clickViewProfile(card: ElementFinder) {
//     return card.element(by.buttonText('VIEW PROFILE')).click();
//   }

//   changeView(viewType: 'card' | 'list') {
//     return element(by.id('view-type-radio')).element(by.css('mat-radio-button[value="' + viewType + '"]')).click();
//   }

//   clickAddOwnerFAB() {
//     return element(by.className('add-owner-fab')).click();
//   }
// }
