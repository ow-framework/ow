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
    this.app = app;
    this.name = this.constructor.name;
  }

  /**
   * "load" is triggered by app instance during startup.
   * Modules will be loaded in parallel as soon as app.start() is triggered.
   *
   * If you have to perform additional actions after all modules have been loaded,
   * setup an event listener on the app instance to wait on the modules:loaded event.
   *
   * @memberof OwModule
   * @returns {OwModule} the module itself
   */
  load() { return Promise.resolve(this); }
}

export default OwModule;
