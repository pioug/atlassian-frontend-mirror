import type { IntlShape } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { code } from '@atlaskit/adf-utils/code';
import { text } from '@atlaskit/adf-utils/text';
import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages/placeholder-text';

export const createShortEmptyNodePlaceholderADF = ({ formatMessage }: IntlShape): DocNode =>
	({
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					code(formatMessage(messages.shortEmptyNodePlaceholderADFSlashShortcut)),
					text(' '),
					text(formatMessage(messages.shortEmptyNodePlaceholderADFSuffix)),
				],
			},
		],
	}) as DocNode;

export const createLongEmptyNodePlaceholderADF = ({ formatMessage }: IntlShape): DocNode =>
	({
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					text(formatMessage(messages.longEmptyNodePlaceholderADFPrefix)),
					text(' '),
					code(formatMessage(messages.longEmptyNodePlaceholderADFSlashShortcut)),
					text(' '),
					text(formatMessage(messages.longEmptyNodePlaceholderADFSuffix)),
				],
			},
		],
	}) as DocNode;
