import { StateNodeConfig } from 'xstate';

import {
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
} from '../types';

export const machineErrorState: StateNodeConfig<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
> = {
  type: 'final',
};
