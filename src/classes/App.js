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

class App {
  constructor() {
    this.logLevel = LOG_LEVEL;
    this.modules = {};
    this.listeners = {};
    this.logger = console;
    this.started = false;
    this.env = getEnv();

    process.on("unhandledRejection", error => {
      console.error(error);
    });
  }

  on(eventName, fn) {
    this.listeners = {
      ...this.listeners,
      [eventName]: [...(this.listeners[eventName] || []), fn]
    };

    return this;
  }

  off(eventName, fn) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = [
        ...this.listeners[eventName].filter(cb => cb !== fn)
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
    console.debug(`Triggering "${fn}" on modules...`);

    // nothing to load, exit
    if (!Object.keys(modules).length) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const modulesToHandle = Object.keys(modules);

      function triggerModule(module = modules[modulesToHandle.shift()]) {
        console.debug(`${fn}: "${module.name}"`);

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
          console.error(`Couldn't trigger ${fn} on modules.\r\n\r\n`, err);
          reject();
        });
    });
  }

  start() {
    console.info(this.started ? `Restarting ow application` : `Starting ow application.`);

    let before = Promise.resolve();

    if (this.started) {
      before = this._triggerModules("unload", this.modules);
    }

    return before
      .then(() => this._triggerModules("ready", this.modules))
      .then(() => {
        console.info(`Started ow application.`);
        this.started = true;
      })
      .catch(e => {
        console.error(e);

        console.error(
          "An error occured during the application start sequence.\r\n" +
            "This is probably not an issue with Ow but a module you loaded.\r\n" +
            "There is likely more logging output above."
        );
      });
  }

  stop() {
    if (this.started) {
      return this._triggerModules("unload", this.modules)
        .then(() => {
          process.off("unhandledRejection");
        });
    }

    return Promise.resolve();
  }
}

export default App;
