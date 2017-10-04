# Dependencies

Due to the small amount of responsibility each module should have, it's very likely that your modules will depend on each other or depend on eg. global or environment variables.

## Module Dependencies

To make sure a module notifies you if it's missing a module dependency, you may add the **dependencies** property to the modules class definition.

```js
class MyModule extends OwModule {
  static dependencies = ['OwKoa'];
}
```

This will make sure that **ow** throws an error in case *OwKoa* is missing during the addModules step which contains *MyModule*.

## Environment Variable Dependencies

To ensure that certain environment variables are set, you may add the **requireEnv** property to the modules class definition.

```js
class MyModule extends OwModule {
  static requireEnv = ['NODE_ENV', 'TMP_DIR'];
}
```

This will make sure that **ow** throws an error in case either *NODE_ENV* or *TMP_DIR* are missing. Depending on the environment you use ow, they have to be defined as properties of either:

**node.js**: ```process.env```

**other**: ```global || window```