import App from './App';
import OwModule from './OwModule';
import * as events from '../constants.events';

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

export default Ow;
