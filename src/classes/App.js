// @flow
import OwModule from './OwModule';

import { MODULES_LOADED } from '../constants.events';

let LOG_LEVEL = 'info';

if (process && process.env && process.env.LOG_LEVEL) {
  LOG_LEVEL = process.env.LOG_LEVEL;
}

class App {
  logLevel = LOG_LEVEL;
  modules = {};
  listeners: { [string]: Array<Function> } = {};
  logger = console;

  on = (eventName: string, fn: Function) => {
    this.listeners = {
      ...this.listeners,
      [eventName]: [...(this.listeners[eventName] || []), fn],
    };

    return this;
  };

  off = (eventName: string, fn: Function) => {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = [
        ...this.listeners[eventName].filter(cb => cb !== fn),
      ];
    }

    return this;
  };

  trigger = (eventName: string) => {
    console.debug(`Event "${eventName}" fired`);

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(fn => fn());
    }
  };

  addModules(modules: Array<Object> = []) {
    this.modules = modules.reduce((acc, Module) => {
      if (typeof Module === 'function') {
        const m: OwModule = new Module(this);

        acc[m.name] = m;
      } else {
        acc[Module.name] = Module;
      }

      return acc;
    }, this.modules);

    return this;
  }

  async _loadModules(modules: Object = this.modules) {
    // nothing to load, exit
    if (!Object.keys(modules).length) return this;

    const modulesToLoad = Object.keys(this.modules);

    async function loadModule(module = modules[modulesToLoad.shift()]) {
      await module.load();

      if (modulesToLoad.length) {
        return loadModule(modules[modulesToLoad.shift()]);
      }

      return Promise.resolve();
    }

    try {
      await loadModule();
    } catch (err) {
      console.error("Couldn't load modules.\r\n\r\n", err);
      return Promise.reject();
    }

    return this;
  }

  async start() {
    await this._loadModules()
      .then(() => {
        console.info('Started ow application...');
        this.trigger(MODULES_LOADED);
      })
      .catch((e) => {
        console.error(e);

        console.error(
          'An error occured during the application start sequence.\r\n' +
            'This is probably not an issue with Ow but a module you loaded.\r\n' +
            'There is likely more logging output above.',
        );
      });

    return this;
  }
}

export default App;
