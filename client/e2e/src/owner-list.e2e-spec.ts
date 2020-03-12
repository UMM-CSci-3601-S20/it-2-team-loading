import {OwnerPage} from './owner-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('Owner list', () => {
  let page: OwnerPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new OwnerPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getOwnerTitle()).toEqual('Owners');
  });

  it('Should type something in the name filter and check that it returned correct elements', async () => {
    await page.typeInput('owner-name-input', 'Robert Denton');
    // added this here to stop the proxy request errors from trying to grab things before typeInput had finished
    await browser.wait(EC.urlContains('/owners'), 10000);

    // All of the owner cards should have the name we are filtering by
    page.getOwnerCards().each(e => {
      expect(e.element(by.className('owner-card-name')).getText()).toEqual('Robert Denton');
    });
  });

  it('Should type something in the officeID filter and check that it returned correct elements', async () => {
    await page.typeInput('owner-officeID-input', '1310');

    // All of the owner cards should have the officeID we are filtering by
    page.getOwnerCards().each(e => {
      expect(e.element(by.className('owner-card-officeID')).getText()).toEqual('1310');
    });
  });

  it('Should type something partial in the name filter and check that it returned correct elements', async () => {
    await page.typeInput('owner-name-input', 'ch');
    await browser.wait(EC.urlContains('/owners'), 10000);

    // Go through each of the cards that are being shown and get the names
    const names = await page.getOwnerCards().map(e => e.element(by.className('owner-card-name')).getText());

    // We should see these names
    expect(names).toContain('Rachel Johnson');
    expect(names).toContain('Indrajit Chaudhury');

    // We shouldn't see these names
    expect(names).not.toContain('Robert Denton');
    expect(names).not.toContain('Emily Bruce');
  });

  it('Should type something in the building filter and check that it returned correct elements', async () => {
    await page.typeInput('owner-building-input', 'science');
    await browser.wait(EC.urlContains('/owners'), 10000);

    // Go through each of the cards that are being shown and get the building names
    const buildings = await page.getOwnerCards().map(e => e.element(by.className('owner-card-building')).getText());

    // We should see the science building in the owner cards
    expect(buildings).toContain('Science');

    // We shouldn't see these building names
    expect(buildings).not.toContain('Camden');
    expect(buildings).not.toContain('The Moon');
  });

  it('Should click view doorboard on a owner and go to the right URL', async () => {

    // grab all the owner info for the first owner displayed for reference
    const firstOwnerName = await page.getOwnerCards().first().element(by.className('owner-card-name')).getText();
    const firstOwnerBuilding = await page.getOwnerCards().first().element(by.className('owner-card-building')).getText();
    const firstOwnerOfficeID = await page.getOwnerCards().first().element(by.className('owner-card-officeID')).getText();
    const firstOwnerEmail = await page.getOwnerCards().first().element(by.className('owner-card-email')).getText();
    await page.clickViewProfile(page.getOwnerCards().first());

    // Wait until the URL contains 'owners/' (note the ending slash)
    await browser.wait(EC.urlContains('/owner/'), 10000);

    // When the view profile button on the first owner card is clicked, the URL should have a valid mongo ID
    const url = await page.getUrl();
    expect(RegExp('/owner/[0-9a-fA-F]{24}/posts$', 'i').test(url)).toBe(true);

  });

  it('Should click add owner and go to the right URL', async () => {
    await page.clickAddOwnerFAB();

    // Wait until the URL contains 'owners/new'
    await browser.wait(EC.urlContains('owners/new'), 10000);

    // When the view profile button on the first owner card is clicked, we should be sent to the right URL
    const url = await page.getUrl();
    expect(url.endsWith('/owners/new')).toBe(true);

    // On this profile page we were sent to, We should see the right title
    expect(element(by.className('add-owner-title')).getText()).toEqual('New Owner');
  });

});
