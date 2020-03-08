import {browser, protractor, by, element, utils} from 'protractor';
import { AddOwnerPage, TestOwner } from './add-owner.po';
import { E2EUtil } from './e2e.util';

describe('Add owner', () => {
  let page: AddOwnerPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddOwnerPage();
    page.navigateTo();
  });

  // it('Should have the correct title', () => {
  //   expect(page.getTitle()).toEqual('New Owner');
  // });


  // it('Should enable and disable the add owner button', async () => {
  //   expect(element(by.buttonText('ADD OWNER')).isEnabled()).toBe(false);
  //   await page.typeInput('nameField', 'test');
  //   expect(element(by.buttonText('ADD OWNER')).isEnabled()).toBe(false);
  //   await page.typeInput('ageField', '20');
  //   expect(element(by.buttonText('ADD OWNER')).isEnabled()).toBe(false);
  //   await page.typeInput('emailField', 'invalid');
  //   expect(element(by.buttonText('ADD OWNER')).isEnabled()).toBe(false);
  //   await page.typeInput('emailField', '@example.com');
  //   expect(element(by.buttonText('ADD OWNER')).isEnabled()).toBe(true);
  // });

  // it('Should add a new owner and go to the right page', async () => {
  //   const owner: TestOwner = {
  //     name: E2EUtil.randomText(10),
  //     age: '30',
  //     company: E2EUtil.randomText(10),
  //     email: E2EUtil.randomText(5) + '@example.com',
  //     role: 'editor'
  //   };

  //   await page.addOwner(owner);

  //   // Wait until the URL does not contain 'owners/new'
  //   await browser.wait(EC.not(EC.urlContains('owners/new')), 10000);

  //   const url = await page.getUrl();
  //   expect(RegExp('.*\/owners\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);
  //   expect(url.endsWith('/owners/new')).toBe(false);

  //   expect(element(by.className('owner-card-name')).getText()).toEqual(owner.name);
  //   expect(element(by.className('owner-card-company')).getText()).toEqual(owner.company);
  //   expect(element(by.className('owner-card-role')).getText()).toEqual(owner.role);
  //   expect(element(by.className('owner-card-age')).getText()).toEqual(owner.age);
  //   expect(element(by.className('owner-card-email')).getText()).toEqual(owner.email);
  // });

});
