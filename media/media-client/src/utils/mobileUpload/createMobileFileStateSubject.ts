import { from } from 'rxjs/observable/from';
import { map } from 'rxjs/operators/map';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { type Interpreter } from 'xstate';

import type { FileState } from '@atlaskit/media-state/file-state';

import {
	type StateMachineContext,
	type StateMachineEvent,
	type StateMachineTypestate,
} from './stateMachine/types';

export const createMobileFileStateSubject = (
	service: Interpreter<StateMachineContext, any, StateMachineEvent, StateMachineTypestate>,
): ReplaySubject<FileState> => {
	const subject = new ReplaySubject<FileState>(1);

	from(service.start())
		.pipe(map((state) => state.context.currentFileState))
		.subscribe(subject);

	return subject;
};
