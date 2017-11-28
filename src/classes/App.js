import { MODULES_LOADED } from '../constants.events';

let LOG_LEVEL = 'info';

if (typeof process === 'object' && process.env && process.env.LOG_LEVEL) {
  LOG_LEVEL = process.env.LOG_LEVEL;
}

function getEnv() {
  if (process && process.env) {
    return process.env;
  } else {
    return global || window;
  }
}

function unhandledRejection(logger, error) {
  logger.error(error);
}

class App {
  constructor({ silent = false } = {}) {
    this.logLevel = LOG_LEVEL;
    this.modules = {}; // module instances
    this.models = {}; // models to be used by modules
    this._listeners = {};
    this.logger = console;
    this._started = false;
    this.env = getEnv();

    if (typeof this.logger.debug === 'undefined') {
      this.logger.debug = this.logger.info;
    }

    if (silent) {
      this.logger = { info: () => {}, log: () => {}, debug: () => {}, error: () => {}, warn: () => {} };
    }

    this.unhandledRejection = unhandledRejection.bind(this, this.logger);

    process.on("unhandledRejection", this.unhandledRejection);
  }

  on(eventName, fn) {
    this._listeners = {
      ...this._listeners,
      [eventName]: [...(this._listeners[eventName] || []), fn]
    };

    return this;
  }

  off(eventName, fn) {
    if (this._listeners[eventName]) {
      this._listeners[eventName] = [
        ...this._listeners[eventName].filter(cb => cb !== fn)
      ];
    }

    return this;
  }

  trigger(eventName) {
    this.logger.debug(`Event "${eventName}" fired`);

    if (this._listeners[eventName]) {
      this._listeners[eventName].forEach(fn => fn());
    }
  }

  addModules(modules = []) {
    const newModules = modules.reduce((acc, Module) => {
      let inst;
      const name = Module.name;

      if (typeof Module === "function") {
        const m = new Module(this);

        acc[name] = m;
      } else {
        acc[name] = Module;
      }
      
      // make sure module has a name
      if (typeof acc[name].name === 'undefined') {
        acc[name].name = name;
      }

      return acc;
    }, {});

    this.modules = {
      ...this.modules,
      ...newModules,
    };

    return this._triggerModules('_ensureDependencies', newModules)
      .then(() => this._triggerModules('load', newModules))
      .then(() => this);
  }

  _triggerModules(fn, modules = this.modules) {
    this.logger.debug(`Triggering "${fn}" on modules...`);

    // nothing to load, exit
    if (!Object.keys(modules).length) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const modulesToHandle = Object.keys(modules);

      const triggerModule = (module = modules[modulesToHandle.shift()]) => {
        this.logger.debug(`${fn}: "${module.name}"`);

        let result = (module[fn] || function() { return Promise.resolve(); })();

        if (typeof result === 'undefined') {
          result = Promise.resolve();
        }
        return result.then(() => {
            if (modulesToHandle.length) {
              return triggerModule(modules[modulesToHandle.shift()]);
            }
          })
          .catch(reject);
      }

      return triggerModule()
        .then(resolve)
        .catch(err => {
          this.logger.error(`Couldn't trigger ${fn} on modules.\r\n\r\n`, err);
          reject();
        });
    });
  }

  start() {
    this.logger.info(this._started ? `Restarting ow application` : `Starting ow application.`);

    let before = Promise.resolve();

    if (this._started) {
      before = this._triggerModules("unload", this.modules);
    }

    return before
      .then(() => this._triggerModules("ready", this.modules))
      .then(() => {
        this.logger.info(`Started ow application.`);
        this._started = true;
      })
      .catch(e => {
        this.logger.error(e);

        this.logger.error(
          "An error occured during the application start sequence.\r\n" +
            "This is probably not an issue with Ow but a module you loaded.\r\n" +
            "There is likely more logging output above."
        );
      });
  }

  stop() {
    process.removeListener('unhandledRejection', this.unhandledRejection);

    if (this._started) {
      return this._triggerModules("unload", this.modules);
    }

    return Promise.resolve();
  }
}

export default App;
