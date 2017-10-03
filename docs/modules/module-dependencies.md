# Module Dependencies

Due to the small amount of responsibility each module should have, it's very likely that your modules will depend on each other.

To make sure a module notifies you if it's missing a dependency, you may add the **dependencies** property to the modules class definition.

```js
class MyModule extends OwModule {
  static dependencies = ['OwKoa'];
}
```

This will make sure that **ow** throws an error in case *OwKoa* is missing during the addModules step which contains *MyModule*.