const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayLoad = {"userEmail": "jaimettb@gmail.com","userPassword": "Ab@123@123"};
const orderPayload = {"orders": [{"country": "Cuba","productOrderedId": "6262e95ae26b7e1a10e89bf0"}]}

let response;
let apiUtils;
let apiContext;

test.beforeAll(async()=>{
    apiContext = await request.newContext();
    apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = apiUtils.createOrder(orderPayload);
});

test.beforeEach(()=>{
    
});

test.only('Place the order', async ({page})=> {
    const response = await apiUtils.createOrder(orderPayload, loginPayLoad);
    console.log(response);
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator(".table-bordered").waitFor();
    var rows = await page.locator("tbody tr");

    for(let i=0; i<await rows.count(); ++i){
        const rowOrderId = await rows.nth(i).locator("th").textContent();

        if(response.orderId.includes(rowOrderId)){
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});