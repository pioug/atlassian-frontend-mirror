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
import type { ExtractInjectionAPI, HeadingLevels } from '@atlaskit/editor-common/types';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';

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
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/d4te57pv7j85c6xr1vui6q708733gfc3.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/284qt5g0c4mqi24osl0df4s3ra301mpx.png',
	},
	1: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/hw6qyn044721b2m7v3102xik2llkf6qb.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1i1ff4is6g200qb6a4181fjecydch0kc.png',
	},
	2: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8abbo27edjqrle6c78u8qj2j67707abu.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8rt7x7u7765v72l0ngw65em701u4s58l.png',
	},
	3: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/350xa31s48b471rf57xhr344rx8qs17a.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/gyt13k2542x5bgq284m10n1hc4baf85j.png',
	},
	4: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/26goi016hs18n0r5243bdh8260ucp58n.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/78356r6s0xwe71o13mfj381gpyqt4niq.png',
	},
	5: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1uou5866vounmn58aunwxkfo20kk871o.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/584t6547t6h570unr3v581oi154625lo.png',
	},
	6: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5h60y538ycf7d7646t0k644iau08027l.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/g3o407j1432fc405m45r82ygbfv44323.png',
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
			iconBefore={getBlockTypeQuickInsertIcon(item)}
			onSelect={onSelect}
			previewImageUrls={previewImageUrls[item]}
			shortcut={shortcut}
			title={title}
		/>
	);
};
