const puppeteer = require('puppeteer');
const product_url = "https://telfar.net/collections/beanies/products/embroidered-beanie-white-white"

async function givePage() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(product_url);
    return page
}

async function addToCart(page){
    await page.goto(product_url);
    // await page.select('#product-template_un-product-select-option-1', 'L');
    await page.waitForSelector("#AddToCart");
    await page.click("#AddToCart", elem => elem.click());
    await page.waitForSelector("#view-cart");
    await page.click("#view-cart", elem => elem.click());
    await page.waitForSelector("button[class='btn cart-checkout-btn']");
    await page.click("button[class='btn cart-checkout-btn']", elem => elem.click());
    
    await page.waitForNavigation();
    await page.waitForTimeout(500);
    await page.type('#checkout_email', 'mtiti3@vt.edu');
    await page.type('#checkout_shipping_address_first_name', 'Matthew');
    await page.type('#checkout_shipping_address_last_name', 'Titi');
    await page.type('#checkout_shipping_address_address1', '1015 UNIVERSITY CITY BLVD');
    await page.type('#checkout_shipping_address_address1', '333');
    await page.type('#checkout_shipping_address_city', 'BLACKSBURG');
    await page.select('#checkout_shipping_address_province', 'VA');
    await page.type('#checkout_shipping_address_zip', '24061-0001');
    await page.type('#checkout_shipping_address_phone', '2');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '1');
    await page.type('#checkout_shipping_address_phone', '4');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '7');
    await page.type('#checkout_shipping_address_phone', '2');
    await page.type('#checkout_shipping_address_phone', '4');
    await page.type('#checkout_shipping_address_phone', '6');
    await page.click("#continue_button", elem => elem.click());

    await page.waitForNavigation();
    await page.waitForTimeout(500);
    await page.click("#continue_button", elem => elem.click());

    await page.waitForNavigation();
    // await page.waitForSelector("#card-fields-number-aak7x0c9s2f00000-scope-telfar.net");

    // await page.type('#card-fields-number-aak7x0c9s2f00000-scope-telfar.net', '4266902037251497');
    // await page.type('#card-fields-name-0ce3kdsodf0m0000-scope-telfar.net', 'Matthew Titi');
    // await page.type('#card-fields-expiry-v9o54ylfn6000000-scope-telfar.net', '04/22');
    // await page.type('#card-fields-verification_value-ohtq0v8v4yo00000-scope-telfar.net', '333');
    // await page.click("#continue_button", elem => elem.click());

    await page.waitForTimeout(500);
    const iframeNum = await page.frames().find(frame => frame.name().includes('card-fields-number'));
    const iframeName = await page.frames().find(frame => frame.name().includes('card-fields-name'));
    const iframeExp = await page.frames().find(frame => frame.name().includes('card-fields-expiry'));
    const iframeVal = await page.frames().find(frame => frame.name().includes('card-fields-verification_value'));

    await iframeNum.type('#number', '4266902037251497');
    await iframeName.type('#name', 'Matthew Titi');
    await page.waitForTimeout(200);
    await iframeExp.type('#expiry', '04/22');
    await page.waitForTimeout(200);
    await iframeVal.type('#verification_value', '322');

    await page.click("#checkout_different_billing_address_false", elem => elem.click());
    await page.click("#continue_button", elem => elem.click());

} 

async function checkout() {
    var page = await givePage();
    await addToCart(page);
}

checkout();