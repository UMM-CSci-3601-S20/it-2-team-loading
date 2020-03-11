import {browser, protractor, by, element, utils} from 'protractor';
import { AddPostPage, TestPost } from './add-post.po';
import { E2EUtil } from './e2e.util';

describe('Add post', () => {
  let page: AddPostPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddPostPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTitle()).toEqual('New Post');
  });


  it('Should enable and disable the add post button', async () => {
    expect(element(by.buttonText('ADD POST')).isEnabled()).toBe(false);
    await page.typeInput('messageField', 'bit.ly/umm-cscc');
    expect(element(by.buttonText('ADD POST')).isEnabled()).toBe(true);
  });

  it('Should add a new post and go to the right page', async () => {
    const post: TestPost = {
      owner_id: E2EUtil.randomText(14),
      message: E2EUtil.randomLetters(10),
      owner: E2EUtil.randomText(10),
    };

    await page.addPost(post);

    // Wait until the URL does not contain 'posts/new
    await browser.wait(EC.not(EC.urlContains('posts/new')), 10000);

    const url = await page.getUrl();
    expect(RegExp('/owner/78f1d3bfa098879fe7a01373/posts').test(url)).toBe(true);
    expect(url.endsWith('/posts/new')).toBe(false);
  });

});

// IDFK where to begin to try and navigate page to for this
// Tried lots of things and nothing worked.
