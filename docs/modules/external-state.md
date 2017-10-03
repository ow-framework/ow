# Accessing External State

Depending on the complexity of your module, you might have to access external state.
Examples for this would be a database connection, a router or meta-information exposed by other modules.

**ow** makes it easy to make data available to all your modules by passing a reference to the whole app instance to
each module during its instantiation.

```js
class MyModule extends OwModule {
  constructor(app, options = {}) {
    super(app);

    this.config = {
      default: 1,
      ...options
    };
  }

  load = () => {
    const { app: { router, db, modules }, config } = this;

    router.get('/', ctx => ctx.body = 'Hello world!'); 
  }
}
```

The order in which modules are added to your application is important. All application events (e.g. **load**, **ready**) will be triggered
sequentially for each module in the application instance.