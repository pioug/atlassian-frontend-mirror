import { LRUMap } from 'lru_map';
import { Interpreter } from 'xstate';

import {
  StateMachineContext,
  StateMachineEvent,
  StateMachineTypestate,
} from './stateMachine/types';

export function createServicesCache() {
  return new LRUMap<
    string,
    Interpreter<
      StateMachineContext,
      any,
      StateMachineEvent,
      StateMachineTypestate
    >
  >(100);
}
