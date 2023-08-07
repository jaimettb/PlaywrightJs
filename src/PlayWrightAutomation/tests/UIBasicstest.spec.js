const {test, expect} = require('@playwright/test');

test('Browser Context Playwright test', async ({browser})=> {
    //Locators
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#username");
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //css
    await userName.type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect')
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await Promise.all([
        page.waitForNavigation(),
        signIn.click()
    ]);
    
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});

test('Page Playwright test', async ({browser, page})=> {
    await page.goto("https://google.com");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});

test('UI Controle', async ({page})=> {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const userName = page.locator("#username");
    const signIn = page.locator("#signInBtn");
    const dropdown = page.locator("select.form-control");
    const documentLink = page.locator("[href*='documents-request']");
    
    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await page.locator("#terms").uncheck();
    await expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child windows hadl', async ({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();   
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([  
        context.waitForEvent('page'),
        await documentLink.click()
    ]);

    var text = await newPage.locator(".red").textContent();
    console.log(text);
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").type(domain);
    console.log(await page.locator("#username").textContent());
});