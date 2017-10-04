# Module Lifecycle

During a modules lifetime it may trigger various lifecycle methods. If not noted otherwise, each lifecycle method may return a ```Promise```.

## ```constructor(app)```

The constructor of your module is (of course) triggered on instantiation. Since you may add a module instance or a class to ```app.addModules([])```, the invocation might look slightly different.

For example, if your module should allow the user to pass  configuration information, the constructor of your class might look like this:

```js
class MyModule extends OwModule {
  constructor(app, options = {}) {
    super(app);

    this.config = {
      someDefault: true,
      ...options
    };
  }
}
```

## ```load()```

The ```load()``` function is called after all modules of a ```app.addModules([])``` call have been instantiated and added to the app instance.

All added module instances of the app will be available on ```this.app.modules```.

The load function will be triggered sequentially in the same order the modules have been defined in the array passed to ```app.addModules([])```.

Use ```load()``` to prepare your module.

## ```ready()```

The ```ready()``` function is called after ```app.start()``` has been called. At this point, all modules should have been loaded and are ready to be used.

If the app has already been started before, ```ready()``` will only be called after the ```unload()``` event fired.

## ```unload()```

The ```unload()``` event is fired when the app is started with ```app.start()``` and the app has already been started before, or when you call ```app.stop()```.

Use this function to perform any cleanup tasks your module has to do before it might re-initialize.


## ```_ensureDependencies()```

This private function should not be overwritten and is triggered after all modules of a ```app.addModules()``` call have been instantiated and added to the app instance.

```_ensureDependencies``` will check whether any of the just added modules has missing dependencies and will throw an error in that case.
