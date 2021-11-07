export default {
  product: 'firefox',
  executablePath: '/usr/bin/firefox',
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
};