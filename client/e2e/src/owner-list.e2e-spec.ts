// import {OwnerPage} from './owner-list.po';
// import {browser, protractor, by, element} from 'protractor';

// describe('Owner list', () => {
//   let page: OwnerPage;
//   const EC = protractor.ExpectedConditions;

//   beforeEach(() => {
//     page = new OwnerPage();
//     page.navigateTo();
//   });

//   it('Should have the correct title', () => {
//     expect(page.getOwnerTitle()).toEqual('Owners');
//   });

//   it('Should type something in the name filter and check that it returned correct elements', async () => {
//     await page.typeInput('owner-name-input', 'Lynn Ferguson');

//     // All of the owner cards should have the name we are filtering by
//     page.getOwnerCards().each(e => {
//       expect(e.element(by.className('owner-card-name')).getText()).toEqual('Lynn Ferguson');
//     });
//   });

//   it('Should type something in the company filter and check that it returned correct elements', async () => {
//     await page.typeInput('owner-company-input', 'OHMNET');

//     // All of the owner cards should have the company we are filtering by
//     page.getOwnerCards().each(e => {
//       expect(e.element(by.className('owner-card-company')).getText()).toEqual('OHMNET');
//     });
//   });

//   it('Should type something partial in the company filter and check that it returned correct elements', async () => {
//     await page.typeInput('owner-company-input', 'ti');

//     // Go through each of the cards that are being shown and get the companies
//     const companies = await page.getOwnerCards().map(e => e.element(by.className('owner-card-company')).getText());

//     // We should see these companies
//     expect(companies).toContain('MOMENTIA');
//     expect(companies).toContain('KINETICUT');

//     // We shouldn't see these companies
//     expect(companies).not.toContain('DATAGENE');
//     expect(companies).not.toContain('OHMNET');
//   });

//   it('Should type something in the age filter and check that it returned correct elements', async () => {
//     await page.typeInput('owner-age-input', '27');

//     // Go through each of the cards that are being shown and get the names
//     const names = await page.getOwnerCards().map(e => e.element(by.className('owner-card-name')).getText());

//     // We should see these owners whose age is 27
//     expect(names).toContain('Stokes Clayton');
//     expect(names).toContain('Bolton Monroe');
//     expect(names).toContain('Merrill Parker');

//     // We shouldn't see these owners
//     expect(names).not.toContain('Connie Stewart');
//     expect(names).not.toContain('Lynn Ferguson');
//   });

//   it('Should change the view', async () => {
//     await page.changeView('list');

//     expect(page.getOwnerCards().count()).toEqual(0); // There should be no cards
//     expect(page.getOwnerListItems().count()).toBeGreaterThan(0); // There should be list items
//   });

//   it('Should select a role, switch the view, and check that it returned correct elements', async () => {
//     await page.selectMatSelectValue('owner-role-select', 'viewer');
//     await page.changeView('list');

//     expect(page.getOwnerListItems().count()).toBeGreaterThan(0);

//     // All of the owner list items should have the role we are looking for
//     page.getOwnerListItems().each(e => {
//       expect(e.element(by.className('owner-list-role')).getText()).toEqual('viewer');
//     });


//   });

//   it('Should click view profile on a owner and go to the right URL', async () => {
//     const firstOwnerName = await page.getOwnerCards().first().element(by.className('owner-card-name')).getText();
//     const firstOwnerCompany = await page.getOwnerCards().first().element(by.className('owner-card-company')).getText();
//     await page.clickViewProfile(page.getOwnerCards().first());

//     // Wait until the URL contains 'owners/' (note the ending slash)
//     await browser.wait(EC.urlContains('owners/'), 10000);

//     // When the view profile button on the first owner card is clicked, the URL should have a valid mongo ID
//     const url = await page.getUrl();
//     expect(RegExp('.*\/owners\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);

//     // On this profile page we were sent to, the name and company should be correct
//     expect(element(by.className('owner-card-name')).getText()).toEqual(firstOwnerName);
//     expect(element(by.className('owner-card-company')).getText()).toEqual(firstOwnerCompany);
//   });

//   it('Should click add owner and go to the right URL', async () => {
//     await page.clickAddOwnerFAB();

//     // Wait until the URL contains 'owners/new'
//     await browser.wait(EC.urlContains('owners/new'), 10000);

//     // When the view profile button on the first owner card is clicked, we should be sent to the right URL
//     const url = await page.getUrl();
//     expect(url.endsWith('/owners/new')).toBe(true);

//     // On this profile page we were sent to, We should see the right title
//     expect(element(by.className('add-owner-title')).getText()).toEqual('New Owner');
//   });

// });
