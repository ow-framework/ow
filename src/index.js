// @flow
import App from './classes/App';
import OwModule, { type OwModuleInterface as _OwModuleInterface } from './classes/OwModule';

import * as events from './constants.events';

const constants = {
  events,
};

export {
  App,

  OwModule,

  constants,
};

export type OwModuleInterface = _OwModuleInterface;

export default App;
