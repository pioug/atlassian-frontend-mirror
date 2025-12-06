import type { IntlShape } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import { code, text } from '@atlaskit/adf-utils/builders';
import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';

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
