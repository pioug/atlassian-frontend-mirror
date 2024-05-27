import { type StateNodeConfig } from 'xstate';

import {
  type StateMachineContext,
  type StateMachineSchema,
  type StateMachineEvent,
} from '../types';

export const machineProcessingFailedState: StateNodeConfig<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
> = {
  type: 'final',
};
