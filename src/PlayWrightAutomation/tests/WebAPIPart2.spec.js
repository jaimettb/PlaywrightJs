const {test, expect, request} = require('@playwright/test');
let webContext;

test.beforeAll(async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("jaimettb@gmail.com");
    await page.locator("#userPassword").fill("Ab@123@123");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'});
    webContext = await browser.newContext({storageState:'state.json'});
});

test('Client App login', async ()=> {
    const email = 'jaimettb@gmail.com';
    const productName = 'zara coat 3';
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    await page.locator("#userEmail").fill("jaimettb@gmail.com");
    await page.locator("#userPassword").fill("Ab@123@123");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    const titles = await page.locator(".card-body b").allTextContents();
    const count = await products.count();
    for(let i=0; i<count; i++)
    {
        if(await products.nth(i).locator("b").textContent() === productName){
            //Add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    await expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").type("ind", {delay:100});
    const dropdown = page.locator(".ta-results");
    await dropdown.first().waitFor();
    var optionsCount = await dropdown.locator("button").count();
    for(let i=0; i<optionsCount;i++){
        var text = await dropdown.locator("button").nth(i).textContent();
        if(text ===" India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator(".table-bordered").waitFor();
    var rows = await page.locator("tbody tr");

    console.log("Cont -- " + await rows.count);

    for(let i=0; i<await rows.count(); ++i){
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        console.log(rowOrderId);

        if(orderId.includes(rowOrderId)){
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
});

test('Test case 2', async ()=> {
    const email = '';
    const productName = 'zara coat 3';
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
});