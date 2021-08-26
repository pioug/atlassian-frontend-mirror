import { LRUCache } from 'lru-fast';
import { Interpreter } from 'xstate';

import {
  StateMachineContext,
  StateMachineEvent,
  StateMachineTypestate,
} from './stateMachine/types';

export function createServicesCache() {
  return new LRUCache<
    string,
    Interpreter<
      StateMachineContext,
      any,
      StateMachineEvent,
      StateMachineTypestate
    >
  >(100);
}
