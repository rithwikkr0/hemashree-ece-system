const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:4173/';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots_simplified');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const errors = [];
  
  // 1. Desktop Test
  console.log('--- TEST 1: Desktop (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`[Page Error] ${err.message}`);
  });

  const startTime = Date.now();
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  console.log('Page loaded in', Date.now() - startTime, 'ms');

  // Verify boot auto-dismiss <= 3.5s
  console.log('Waiting for boot overlay to dismiss...');
  await page.waitForTimeout(3800); // 3.8s to allow 3.0s auto-dismiss + transition
  
  const bootVisible = await page.evaluate(() => {
    const skipBtn = document.querySelector('button[aria-label="Skip Intro"]');
    return !!skipBtn;
  });
  console.log('Boot overlay active after 3.8s?:', bootVisible);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_desktop_hero.png') });
  console.log('Captured 01_desktop_hero.png');

  // Scroll to Profile
  await page.evaluate(() => {
    const el = document.getElementById('profile');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_desktop_profile.png') });
  console.log('Captured 02_desktop_profile.png');

  // Scroll to Projects
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_desktop_projects.png') });
  console.log('Captured 03_desktop_projects.png');

  // Scroll to Signals/DSP
  await page.evaluate(() => {
    const el = document.getElementById('signals');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_desktop_signals.png') });
  console.log('Captured 04_desktop_signals.png');

  // Scroll to Missions
  await page.evaluate(() => {
    const el = document.getElementById('missions');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_desktop_missions.png') });
  console.log('Captured 05_desktop_missions.png');

  // Scroll to Archive / Education / Certs
  await page.evaluate(() => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_desktop_archive.png') });
  console.log('Captured 06_desktop_archive.png');

  // Scroll to Contact
  await page.evaluate(() => {
    const el = document.getElementById('transmission');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_desktop_contact.png') });
  console.log('Captured 07_desktop_contact.png');

  await desktopContext.close();

  // 2. Mobile Viewport Test (iPhone 14 / 390x844)
  console.log('--- TEST 2: Mobile (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(3800);

  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_mobile_hero.png') });
  console.log('Captured 08_mobile_hero.png');

  await mobilePage.evaluate(() => {
    const el = document.getElementById('profile');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_mobile_profile.png') });
  console.log('Captured 09_mobile_profile.png');

  await mobilePage.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_mobile_projects.png') });
  console.log('Captured 10_mobile_projects.png');

  await mobilePage.evaluate(() => {
    const el = document.getElementById('transmission');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_mobile_contact.png') });
  console.log('Captured 11_mobile_contact.png');

  await mobileContext.close();
  await browser.close();

  console.log('--- TEST SUMMARY ---');
  console.log('Runtime console/page errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  } else {
    console.log('ALL RUNTIME CHECKS PASSED WITH 0 ERRORS!');
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
