/**
 * Base class for ow modules.
 *
 * @class OwModule
 */
class OwModule {
  /**
   * Each module receives the app instance it belongs to.
   * By utilizing this app instance, modules may set up routers,
   * event listeners and much more to build any kind of application.
   *
   * @param app application instance this module belongs to
   * @memberof OwModule
   */
  constructor(app) {
    const self = this;

    this.app = app;
    this.name = this.constructor.name;
    this._dependencies = this.constructor.dependencies;

    this.load = function() { return Promise.resolve(self); }
    this.ready = function() { return Promise.resolve(self); }

    this._ensureDependencies = function() {
      if (!self._dependencies) return;
      
      self._dependencies.forEach(dep => {
        if (typeof self.app.modules[dep] === 'undefined') {
          throw new Error(`${self.name} depends on ${dep}, but ${dep} was not loaded before ${self.name}. Check your boot sequence.`);
        }
      });
    }
  }
}

export default OwModule;
