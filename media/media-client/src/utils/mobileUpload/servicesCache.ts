import { LRUMap } from 'lru_map';
import { type Interpreter } from 'xstate';

import {
  type StateMachineContext,
  type StateMachineEvent,
  type StateMachineTypestate,
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
