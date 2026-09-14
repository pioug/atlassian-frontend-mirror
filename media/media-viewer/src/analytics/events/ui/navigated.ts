import {
	type UIEventPayload,
	type UIAttributes,
	type WithFileAttributes,
} from '@atlaskit/media-common';

export type NavigatedAttributes = UIAttributes &
	WithFileAttributes & {
		input: 'button' | 'keys';
	};

export type NavigatedEventPayload = UIEventPayload<NavigatedAttributes, 'navigated', 'file'> & {
	actionSubjectId: 'next' | 'previous';
};

export type NavigatedInput = 'button' | 'keys';
