import type {
	UIEventPayload,
	UIAttributes,
	WithFileAttributes,
} from '@atlaskit/media-common/analytics/types';

export type NavigatedAttributes = UIAttributes &
	WithFileAttributes & {
		input: 'button' | 'keys';
	};

export type NavigatedEventPayload = UIEventPayload<NavigatedAttributes, 'navigated', 'file'> & {
	actionSubjectId: 'next' | 'previous';
};

export type NavigatedInput = 'button' | 'keys';
