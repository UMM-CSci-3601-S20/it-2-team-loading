const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

config.highlightDelay = undefined;

config.seleniumServerJar = process.env.SELENIUM_JAR_PATH;
config.chromeDriver = process.env.CHROMEWEBDRIVER + '/chromedriver';

exports.config = config;
