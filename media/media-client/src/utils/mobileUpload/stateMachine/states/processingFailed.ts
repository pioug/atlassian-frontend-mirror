import { StateNodeConfig } from 'xstate';

import {
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
} from '../types';

export const machineProcessingFailedState: StateNodeConfig<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
> = {
  type: 'final',
};
