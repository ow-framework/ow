# Create a new module

Creating a new module is as simple as:

```js
import { OwModule } from 'ow-core';

class OwExampleModule extends OwModule {
  load = () => {
    console.log('Loading my custom module!');
  }

  ready = () => {
    console.log('All modules loaded! The application is ready!');
  }
}

export default OwExampleModule;
```

That's all you need to do! Your custom module will be called "OwExampleModule", and you may load it with the app.addModules([]) function.

```js
import Ow from 'ow-core';
import MyModule from './modules/example;

const app = new Ow();

app.addModules([
  MyModule
]);

app.start();
```