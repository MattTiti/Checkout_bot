const puppeteer = require('puppeteer');
const product_url = "https://telfar.net/collections/pills/products/the-small-pill-black?variant=40231782875235"

/**
 * Creates a chromium page controlled by puppeteer.
 * @returns A chromium page controlled by puppeteer.
 */
async function givePage() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(product_url);
    return page
}

/**
 * Solves a captcha using the AntiCaptcha API.
 * @param {*} page The chromium page being controlled by puppeteer.
 * @returns The solved captcha as a string.
 */
async function solveCaptcha(page) {
    const captchaImgUrl = await page.$eval("#captcha_image", el => el.getAttribute("src"));

    // Download the captcha image
    const imageBuffer = await (await fetch(captchaImgUrl)).arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Submit the captcha image to AntiCaptcha and wait for the response
    const taskId = await anticaptcha.createImageToTextTask(imageBase64);
    let result = "";
    while (result === "") {
        await new Promise(resolve => setTimeout(resolve, 5000));
        result = await anticaptcha.getTaskResult(taskId);
    }

    return result;
}

/**
 * Adds item to cart and navigates to cart.
 * @param {*} page The chromium page being controlled by puppeteer.
 */
async function addToCart(page){
    await page.goto(product_url);
    // await page.select('#product-template_un-product-select-option-1', 'L');
    await page.waitForSelector("#AddToCart");
    await page.click("#Quantity", elem => elem.click());

    await page.click("#AddToCart", elem => elem.click());
    await page.waitForSelector("#view-cart");
    await page.waitForTimeout(500);
    await page.click("#view-cart", elem => elem.click());
    await page.waitForSelector("button[class='btn cart-checkout-btn']");
    await page.click("button[class='btn cart-checkout-btn']", elem => elem.click());
} 

/**
 * Fills out shipping information and navigates to the payment page .
 * @param {*} page The chromium page being controlled by puppeteer.
 */
async function fillShipping(page){
    await page.waitForNavigation();
    await page.waitForTimeout(500);
    await page.type('#checkout_email', 'mtiti3@vt.edu');
    await page.type('#checkout_shipping_address_first_name', 'Matthew');
    await page.type('#checkout_shipping_address_last_name', 'Titi');
    await page.type('#checkout_shipping_address_address1', '1000 UNIVERSITY CITY BLVD');
    await page.type('#checkout_shipping_address_address1', '342');
    await page.type('#checkout_shipping_address_city', 'BLACKSBURG');
    await page.select('#checkout_shipping_address_province', 'VA');
    await page.type('#checkout_shipping_address_zip', '24061-0001');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '1');
    await page.type('#checkout_shipping_address_phone', '4');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '7');
    await page.type('#checkout_shipping_address_phone', '2');
    await page.type('#checkout_shipping_address_phone', '0');
    await page.type('#checkout_shipping_address_phone', '6');
    await page.click("#continue_button", elem => elem.click());
}
/**
 * Fills out payment information and places order.
 * @param {*} page The chromium page being controlled by puppeteer.
 */
async function fillPayment(page) {
    await page.waitForNavigation();
    await page.waitForTimeout(500);
    await page.click("#continue_button", elem => elem.click());
    await page.waitForNavigation();
    await page.waitForTimeout(4000);

    const solvedCaptcha = await solveCaptcha(page);
    console.log("Solved captcha: " + solvedCaptcha);


    const iframeNum = await page.frames().find(frame => frame.name().includes('card-fields-number'));
    const iframeName = await page.frames().find(frame => frame.name().includes('card-fields-name'));
    const iframeExp = await page.frames().find(frame => frame.name().includes('card-fields-expiry'));
    const iframeVal = await page.frames().find(frame => frame.name().includes('card-fields-verification_value'));

    await iframeNum.type('#number', '424224242442424');
    await iframeName.type('#name', 'Matthew Titi');
    await page.waitForTimeout(200);
    await iframeExp.type('#expiry', '03/28');
    await page.waitForTimeout(200);
    await iframeVal.type('#verification_value', '020');

    await page.click("#checkout_different_billing_address_false", elem => elem.click());
    await page.click("#continue_button", elem => elem.click());
}

/**
 * This is the main method of the program that checks out the item.
 */
async function checkout() {
    var page = await givePage();
    await addToCart(page);
    await fillShipping(page);
    await fillPayment(page);
}

checkout();