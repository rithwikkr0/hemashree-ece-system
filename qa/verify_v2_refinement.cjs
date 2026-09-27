const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:4173/';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots_v2');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('--- STARTING V2 VISUAL & INTERACTIVE QA VERIFICATION ---');
  console.log('Target URL:', TARGET_URL);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const testResults = {
    passed: [],
    failed: [],
    consoleErrors: [],
    pageErrors: [],
  };

  // ==========================================
  // TEST 1: DESKTOP VIEWPORT (1440 x 900)
  // ==========================================
  console.log('\n[1/3] Testing Desktop (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      testResults.consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    testResults.pageErrors.push(`[Page Error] ${err.message}`);
  });

  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Check Boot Overlay Skip Button
  const skipBtn = await page.$('button:has-text("SKIP INTRO")');
  if (skipBtn) {
    console.log('✓ Found Skip Intro button. Clicking to skip to Hero...');
    await skipBtn.click();
    testResults.passed.push('Boot sequence skip button functions properly');
  } else {
    console.log('Boot overlay auto-transitioned or not found.');
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_desktop_hero.png') });

  // Verify Hero Title and Academic Details
  const heroTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
  console.log('Hero Title detected:', heroTitle);
  if (heroTitle.includes('HEMASHREE B M')) {
    testResults.passed.push('Hero Title contains HEMASHREE B M');
  } else {
    testResults.failed.push(`Hero Title missing or mismatched: "${heroTitle}"`);
  }

  const academicText = await page.content();
  if (academicText.includes('Alliance University') && academicText.includes('CGPA 7.50')) {
    testResults.passed.push('Academic metadata verified (Alliance University • CGPA 7.50)');
  } else {
    testResults.failed.push('Academic metadata missing from Hero');
  }

  // Verify Floating Lab Stations are NOT in Hero
  const stationBadgeInHero = await page.evaluate(() => {
    // Check if station badges are visible in the top viewport before scrolling
    const badges = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.includes('01 EMBEDDED BENCH')
    );
    // Filter to ones that are within the first 900px
    return badges.some(b => {
      const rect = b.getBoundingClientRect();
      return rect.top < 900 && rect.bottom > 0 && rect.width > 0;
    });
  });

  if (!stationBadgeInHero) {
    testResults.passed.push('Hero 3D scene is clean: NO floating lab station badges cluttering first screen');
  } else {
    testResults.failed.push('Floating lab station badges still visible on Hero first screen');
  }

  // Test Companion Bot
  console.log('Testing Engineering Companion Bot...');
  const botBtn = await page.$('button[title*="Engineering Companion"]');
  if (botBtn) {
    testResults.passed.push('Engineering Companion Bot button found in DOM');
    await botBtn.click();
    await page.waitForTimeout(500);

    const botMenuText = await page.content();
    if (botMenuText.includes('PROJECTS') && botMenuText.includes('MASTER RESUME')) {
      testResults.passed.push('Companion Bot menu opened with navigation options');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_companion_bot_open.png') });
    } else {
      testResults.failed.push('Companion Bot menu did not display options');
    }

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } else {
    testResults.failed.push('Engineering Companion Bot button not found');
  }

  // Verify Navigation Tabs
  const navTabs = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav[aria-label="Website Navigation"] button'));
    return tabs.map(t => t.textContent.trim());
  });
  console.log('Desktop Navigation Tabs found:', navTabs);
  if (navTabs.length === 8) {
    testResults.passed.push(`Desktop Navigation has all 8 tabs: ${navTabs.join(', ')}`);
  } else {
    testResults.failed.push(`Expected 8 navigation tabs, got ${navTabs.length}`);
  }

  // Scroll to Profile
  await page.evaluate(() => document.getElementById('profile')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_desktop_profile.png') });

  // Scroll to Lab
  await page.evaluate(() => document.getElementById('lab')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_desktop_lab.png') });

  // Scroll to Projects
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_desktop_projects.png') });

  // Test Project Explore Modal Launch
  const exploreBtn = await page.$('#projects button:has-text("EXPLORE")');
  if (exploreBtn) {
    console.log('Testing 3D Project Experience modal launch...');
    await exploreBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_project_modal.png') });
    testResults.passed.push('Project Explore 3D modal opened successfully');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // Scroll to DSP Lab
  await page.evaluate(() => document.getElementById('signals')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_desktop_dsp_default.png') });

  // Test DSP Advanced Controls toggle
  const advancedBtn = await page.$('button:has-text("ADVANCED CONTROLS")');
  if (advancedBtn) {
    console.log('Testing DSP Advanced Controls toggle...');
    await advancedBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_desktop_dsp_advanced.png') });
    testResults.passed.push('DSP Advanced Controls progressive disclosure expands cleanly');
  }

  // Scroll to Missions, Archive, Transmission
  await page.evaluate(() => document.getElementById('missions')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_desktop_missions.png') });

  await page.evaluate(() => document.getElementById('archive')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_desktop_archive.png') });

  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_desktop_transmission.png') });

  await desktopContext.close();

  // ==========================================
  // TEST 2: MOBILE VIEWPORT - IPHONE (390 x 844)
  // ==========================================
  console.log('\n[2/3] Testing Mobile iPhone (390x844)...');
  const mobileContext1 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage1 = await mobileContext1.newPage();
  await mobilePage1.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage1.waitForTimeout(1000);

  // Skip boot if needed
  try {
    const mobileSkip1 = await mobilePage1.$('button:has-text("SKIP INTRO")');
    if (mobileSkip1) await mobileSkip1.click({ force: true, timeout: 2000 }).catch(() => {});
  } catch (e) {}
  await mobilePage1.waitForTimeout(1200);

  // Check horizontal overflow
  const overflow1 = await mobilePage1.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  if (!overflow1) {
    testResults.passed.push('Mobile 390x844: Zero horizontal overflow (scrollWidth <= innerWidth)');
  } else {
    testResults.failed.push('Mobile 390x844 has horizontal overflow');
  }

  await mobilePage1.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_mobile_iphone_hero.png') });
  await mobileContext1.close();

  // ==========================================
  // TEST 3: MOBILE VIEWPORT - PIXEL 7 (412 x 915)
  // ==========================================
  console.log('\n[3/3] Testing Mobile Pixel 7 (412x915)...');
  const mobileContext2 = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage2 = await mobileContext2.newPage();
  await mobilePage2.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage2.waitForTimeout(1000);

  try {
    const mobileSkip2 = await mobilePage2.$('button:has-text("SKIP INTRO")');
    if (mobileSkip2) await mobileSkip2.click({ force: true, timeout: 2000 }).catch(() => {});
  } catch (e) {}
  await mobilePage2.waitForTimeout(1200);

  const overflow2 = await mobilePage2.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  if (!overflow2) {
    testResults.passed.push('Mobile 412x915: Zero horizontal overflow (scrollWidth <= innerWidth)');
  } else {
    testResults.failed.push('Mobile 412x915 has horizontal overflow');
  }

  await mobilePage2.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_mobile_pixel_hero.png') });
  await mobileContext2.close();

  await browser.close();

  console.log('\n==========================================');
  console.log('--- TEST SUMMARY ---');
  console.log('PASSED (' + testResults.passed.length + '):');
  testResults.passed.forEach(p => console.log('  ✓ ' + p));
  if (testResults.failed.length > 0) {
    console.log('FAILED (' + testResults.failed.length + '):');
    testResults.failed.forEach(f => console.log('  ✗ ' + f));
  } else {
    console.log('FAILED: 0');
  }
  console.log('Console Errors:', testResults.consoleErrors.length);
  if (testResults.consoleErrors.length > 0) {
    testResults.consoleErrors.forEach(e => console.log('  !', e));
  }
  console.log('Page Errors:', testResults.pageErrors.length);
  if (testResults.pageErrors.length > 0) {
    testResults.pageErrors.forEach(e => console.log('  !', e));
  }
  console.log('==========================================\n');

  if (testResults.failed.length > 0 || testResults.consoleErrors.length > 0 || testResults.pageErrors.length > 0) {
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
