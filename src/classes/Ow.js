const App = require('./App');
const OwModule = require('./OwModule');
const events = require('./constants.events');

const constants = {
  events,
};

class Ow {
  constructor(...args) {
    this.args = args;
    this.app = new App(...args);

    return this.app;
  }
}

Ow.OwModule = OwModule;
Ow.constants = constants;

module.exports = Ow;
