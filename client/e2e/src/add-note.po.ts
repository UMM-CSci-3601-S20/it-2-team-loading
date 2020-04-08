import { browser, by, element} from 'protractor';

export interface TestNote {
  owner_id: string;
  message: string;
  owner: string;
  expiration: string
}

export class AddNotePage {
  navigateTo() {
    return browser.get('/owner/78f1d3bfa098879fe7a01373/notes/new');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getTitle() {
    const title = element(by.className('add-note-title')).getText();
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

  clickAddNote() {
    return element(by.buttonText('ADD NOTE')).click();
  }

  async addNote(newNote: TestNote) {
    await this.typeInput('messageField', newNote.message);
    return this.clickAddNote();
  }
}
