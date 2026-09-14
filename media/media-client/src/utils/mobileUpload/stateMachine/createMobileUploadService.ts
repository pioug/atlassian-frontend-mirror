import { interpret, type Interpreter, type StateMachine } from 'xstate';

import {
	type StateMachineContext,
	type StateMachineEvent,
	type StateMachineSchema,
	type StateMachineTypestate,
} from './types';

export function createMobileUploadService(
	machine: StateMachine<
		StateMachineContext,
		StateMachineSchema,
		StateMachineEvent,
		StateMachineTypestate
	>,
): Interpreter<StateMachineContext, StateMachineSchema, StateMachineEvent, StateMachineTypestate> {
	return interpret(machine);
}
