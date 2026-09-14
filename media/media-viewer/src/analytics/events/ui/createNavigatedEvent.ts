import { type Identifier, isFileIdentifier } from '@atlaskit/media-client';

import { type NavigationDirection, type NavigationSource } from '../../../navigation';
import { inputFromSource } from './inputFromSource';
import type { NavigatedEventPayload } from './navigated';

export const createNavigatedEvent = (
	direction: NavigationDirection,
	source: NavigationSource,
	identifier: Identifier,
): NavigatedEventPayload => ({
	eventType: 'ui',
	action: 'navigated',
	actionSubject: 'file',
	actionSubjectId: direction === 'next' ? 'next' : 'previous',
	attributes: {
		fileAttributes: {
			fileId: isFileIdentifier(identifier) ? identifier.id : '',
		},
		input: inputFromSource(source),
	},
});
