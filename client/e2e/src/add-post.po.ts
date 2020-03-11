import { browser, by, element, Key, ElementFinder } from 'protractor';

export interface TestPost {
  owner_id: string;
  message: string;
  owner: string;
}

export class AddPostPage {
  navigateTo() {
    return browser.get('/owner/78f1d3bfa098879fe7a01373/posts/new');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getTitle() {
    const title = element(by.className('add-post-title')).getText();
    return title;
  }

  async typeInput(inputId: string, text: string) {
    const input = element(by.id(inputId));
    await input.click();
    await input.sendKeys(text);
  }

  selectMatSelectValue(selectID: string, value: string) {
    const sel = element(by.id(selectID));
    return sel.click().then(() => {
      return element(by.css('mat-option[value="' + value + '"]')).click();
    });
  }

  clickAddPost() {
    return element(by.buttonText('ADD POST')).click();
  }

  async addPost(newPost: TestPost) {
    await this.typeInput('messageField', newPost.message);
    return this.clickAddPost();
  }
}
