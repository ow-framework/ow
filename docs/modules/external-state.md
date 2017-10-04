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

## Models

To keep certain entity types consistent in terms of naming, each **ow** application instance automatically contains a ```models``` object which may be used by modules to share models with other modules.

For example, you might use the *ow-user* module. Then you'd add the *ow-passport-local-koa* module which adds username/password authentication to your application. The *ow-user* module puts the user model on ```app.models.User``` so the *ow-passport-local-koa* module can access it easily during load/ready lifecycle functions.

Together with the multi-tenancy module, this allows you to easily build multi-tenant apps without headaches.