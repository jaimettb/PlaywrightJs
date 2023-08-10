const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayLoad = {"userEmail": "jaimettb@gmail.com","userPassword": "Ab@123@123"};
const orderPayload = {"orders": [{"country": "Cuba","productOrderedId": "6262e95ae26b7e1a10e89bf0"}]}
const fakePayloadOrders = {data:[], message:"No Orders"};

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

test('Place the order', async ({page})=> {
    const response = await apiUtils.createOrder(orderPayload, loginPayLoad);
    console.log(response);
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/64ca3e037244490f9593b5e6",
        async route=>{
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadOrders);
            route.fulfill(
                {
                    response,
                    body
                }
            )
        }
    )

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());
});