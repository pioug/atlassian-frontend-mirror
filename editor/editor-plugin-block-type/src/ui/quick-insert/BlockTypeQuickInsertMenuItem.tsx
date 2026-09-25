import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	toggleHeading1,
	toggleHeading2,
	toggleHeading3,
	toggleHeading4,
	toggleHeading5,
	toggleHeading6,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI, HeadingLevels } from '@atlaskit/editor-common/types';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';

import type { BlockTypePlugin } from '../../blockTypePluginType';

export type BlockTypeQuickInsertItem = 'blockquote' | HeadingLevels;

type Props = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	item: BlockTypeQuickInsertItem;
};

type HeadingQuickInsertMessages = { description: MessageDescriptor; title: MessageDescriptor };

const headingQuickInsertMessages: Record<HeadingLevels, HeadingQuickInsertMessages> = {
	1: { description: messages.heading1Description, title: messages.heading1 },
	2: { description: messages.heading2Description, title: messages.heading2 },
	3: { description: messages.heading3Description, title: messages.heading3 },
	4: { description: messages.heading4Description, title: messages.heading4 },
	5: { description: messages.heading5Description, title: messages.heading5 },
	6: { description: messages.heading6Description, title: messages.heading6 },
};

const headingQuickInsertShortcuts: Record<HeadingLevels, string> = {
	1: tooltip(toggleHeading1) ?? '',
	2: tooltip(toggleHeading2) ?? '',
	3: tooltip(toggleHeading3) ?? '',
	4: tooltip(toggleHeading4) ?? '',
	5: tooltip(toggleHeading5) ?? '',
	6: tooltip(toggleHeading6) ?? '',
};

const previewImageUrls: Record<BlockTypeQuickInsertItem, { dark: string; light: string }> = {
	blockquote: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVIC.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVL6.png',
	},
	1: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVJH.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVLN.png',
	},
	2: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVI2.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVMW.png',
	},
	3: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVID.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVLC.png',
	},
	4: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVIT.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVM2.png',
	},
	5: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVHK.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVLZ.png',
	},
	6: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVIB.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVN0.png',
	},
};

export const getHeadingQuickInsertMessages = (level: HeadingLevels): HeadingQuickInsertMessages =>
	headingQuickInsertMessages[level];

export const getHeadingQuickInsertShortcut = (level: HeadingLevels): string =>
	headingQuickInsertShortcuts[level];

const getBlockTypeQuickInsertIcon = (item: BlockTypeQuickInsertItem): React.JSX.Element => {
	switch (item) {
		case 'blockquote':
			return <QuotationMarkIcon label="" />;
		case 1:
			return <TextHeadingOneIcon label="" />;
		case 2:
			return <TextHeadingTwoIcon label="" />;
		case 3:
			return <TextHeadingThreeIcon label="" />;
		case 4:
			return <TextHeadingFourIcon label="" />;
		case 5:
			return <TextHeadingFiveIcon label="" />;
		case 6:
			return <TextHeadingSixIcon label="" />;
	}
};

export const BlockTypeQuickInsertMenuItem = ({ api, item }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isBlockquote = item === 'blockquote';
	const shortcut = useMemo(
		() => (isBlockquote ? '>' : getHeadingQuickInsertShortcut(item)),
		[isBlockquote, item],
	);
	const title = formatMessage(
		item === 'blockquote' ? messages.blockquote : getHeadingQuickInsertMessages(item).title,
	);
	const description = formatMessage(
		item === 'blockquote'
			? messages.blockquoteDescription
			: getHeadingQuickInsertMessages(item).description,
	);
	const preview = useMemo(
		() => ({
			image: previewImageUrls[item],
			attribution: { name: formatMessage(quickInsertMessages.previewAttributionAtlassian) },
		}),
		[formatMessage, item],
	);
	const onSelect = useCallback(
		({ editorView, insert }: OnSelectContext) => {
			const { schema } = editorView.state;
			const tr = isBlockquote
				? insert(schema.nodes.blockquote.createChecked({}, schema.nodes.paragraph.createChecked()))
				: insert(schema.nodes.heading.createChecked({ level: item }));

			if (item === 'blockquote') {
				api?.analytics?.actions.attachAnalyticsEvent({
					action: ACTION.FORMATTED,
					actionSubject: ACTION_SUBJECT.TEXT,
					actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
					attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
					eventType: EVENT_TYPE.TRACK,
				})(tr);
			} else {
				api?.analytics?.actions.attachAnalyticsEvent({
					action: ACTION.FORMATTED,
					actionSubject: ACTION_SUBJECT.TEXT,
					actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
					attributes: {
						inputMethod: INPUT_METHOD.QUICK_INSERT,
						newHeadingLevel: item,
					},
					eventType: EVENT_TYPE.TRACK,
				})(tr);
			}

			return tr;
		},
		[api, isBlockquote, item],
	);

	return (
		<QuickInsertMenuItem
			description={description}
			iconBefore={getBlockTypeQuickInsertIcon(item)}
			onSelect={onSelect}
			preview={preview}
			shortcut={shortcut}
			title={title}
		/>
	);
};
