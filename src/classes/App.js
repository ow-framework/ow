const { MODULES_LOADED } = require('../constants.events');

let LOG_LEVEL = 'info';

if (typeof process === 'object' && process.env && process.env.LOG_LEVEL) {
  LOG_LEVEL = process.env.LOG_LEVEL;
}

class App {
  constructor() {
    this.logLevel = LOG_LEVEL;
    this.modules = {};
    this.listeners = { };
    this.logger = console;
  }

  on(eventName, fn) {
    this.listeners = {
      ...this.listeners,
      [eventName]: [...(this.listeners[eventName] || []), fn],
    };

    return this;
  }

  off(eventName, fn) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = [
        ...this.listeners[eventName].filter(cb => cb !== fn),
      ];
    }

    return this;
  }

  trigger(eventName) {
    console.debug(`Event "${eventName}" fired`);

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(fn => fn());
    }
  }

  addModules(modules = []) {
    this.modules = modules.reduce((acc, Module) => {
      if (typeof Module === 'function') {
        const m = new Module(this);

        acc[m.name] = m;
      } else {
        acc[Module.name] = Module;
      }

      return acc;
    }, this.modules);

    return this;
  }

  _loadModules(modules = this.modules) {
    // nothing to load, exit
    if (!Object.keys(modules).length) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const modulesToLoad = Object.keys(this.modules);

      function loadModule(module = modules[modulesToLoad.shift()]) {
        return new Promise((resolve2) => {
          module.load()
          .then(() => {
            if (modulesToLoad.length) {
              return loadModule(modules[modulesToLoad.shift()]);
            }

            return resolve2();
          })
          .catch(reject);
        });
      }

      return loadModule()
      .then(resolve)
      .catch((err) => {
        console.error("Couldn't load modules.\r\n\r\n", err);
        reject();
      });
    });
  }

  start() {
    return this._loadModules()
      .then(() => {
        console.info('Started ow application...');
        this.trigger(MODULES_LOADED);
      })
      .then(() => this)
      .catch((e) => {
        console.error(e);

        console.error('An error occured during the application start sequence.\r\n' +
            'This is probably not an issue with Ow but a module you loaded.\r\n' +
            'There is likely more logging output above.');
      });
  }
}

module.exports = App;
