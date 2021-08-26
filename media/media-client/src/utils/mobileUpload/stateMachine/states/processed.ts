import { StateNodeConfig } from 'xstate';

import {
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
} from '../types';

export const machineProcessedState: StateNodeConfig<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
> = {
  type: 'final',
};
