/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { MemoizedFn } from 'memoize-one';
import memoizeOne from 'memoize-one';

import {
	addLink,
	getAriaKeyshortcuts,
	toggleTable,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import {
	ACTION_MENU_ITEM,
	BLOCKQUOTE_MENU_ITEM,
	CODE_BLOCK_MENU_ITEM,
	DATE_MENU_ITEM,
	DECISION_MENU_ITEM,
	EMOJI_MENU_ITEM,
	EXPAND_MENU_ITEM,
	HYPERLINK_MENU_ITEM,
	INFO_PANEL_MENU_ITEM,
	MEDIA_INSERT_MENU_ITEM,
	MENTION_MENU_ITEM,
	PLACEHOLDER_TEXT_MENU_ITEM,
	RULE_MENU_ITEM,
	STATUS_MENU_ITEM,
	TABLE_MENU_ITEM,
	TWO_COLUMNS_LAYOUT_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut/main';
import FieldTextIcon from '@atlaskit/icon-lab/core/field-text';
import LozengeIcon from '@atlaskit/icon-lab/core/lozenge';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ExpandNodeIcon from '@atlaskit/icon/core/chevron-right';
import DecisionIcon from '@atlaskit/icon/core/decision';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import GridIcon from '@atlaskit/icon/core/grid';
import ImageIcon from '@atlaskit/icon/core/image';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
import LinkIcon from '@atlaskit/icon/core/link';
import MentionIcon from '@atlaskit/icon/core/mention';
import HorizontalRuleIcon from '@atlaskit/icon/core/minus';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import InformationIcon from '@atlaskit/icon/core/status-information';
import TaskIcon from '@atlaskit/icon/core/task';
import type { NewCoreIconProps } from '@atlaskit/icon/types';

import { shallowEquals } from './shallow-equals';

interface ItemInit {
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	'aria-label'?: React.AriaAttributes['aria-label'];
	content: string;
	disabled: boolean;
	Icon: React.ComponentType<
		Omit<NewCoreIconProps, 'spacing'> & {
			label: string;
			spacing: 'spacious';
		}
	>;
	name: string;
	/** Registered quick insert menu key of the matching item, for analytics. */
	registeredKey?: string;
	shortcut?: string;
	tooltipDescription?: string;
}

const from = (init: ItemInit): MenuItem => ({
	content: init.content,
	tooltipDescription: init.tooltipDescription,
	value: { name: init.name },
	registeredKey: init.registeredKey,
	elemBefore: <init.Icon label="" color="currentColor" spacing="spacious" />,
	elemAfter: init.shortcut ? (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={shortcutStyle}>{init.shortcut}</div>
	) : undefined,
	'aria-label': init.shortcut ? init.content + ' ' + init.shortcut : init.content,
	'aria-haspopup': init['aria-haspopup'],
	'aria-keyshortcuts': init['aria-keyshortcuts'],
	shortcut: init.shortcut,
	isDisabled: init.disabled,
});

export interface CreateInit {
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-label'?: React.AriaAttributes['aria-label'];
	content: string;
	disabled: boolean;
	tooltipDescription?: string;
}

const mem = <TFunc extends (...args: CreateInit[]) => MenuItem>(fn: TFunc): MemoizedFn<TFunc> =>
	memoizeOne(fn, shallowEquals);

export const action: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem => {
		return from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: ACTION_MENU_ITEM.key,
			name: 'action',
			shortcut: '[]',
			Icon: () => <TaskIcon label="" color="currentColor" spacing="spacious" />,
			'aria-keyshortcuts': '[ ] Space',
		});
	},
);

export const link: MemoizedFn<(init: CreateInit) => MenuItem> = mem((init: CreateInit): MenuItem =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		registeredKey: HYPERLINK_MENU_ITEM.key,
		name: 'link',
		shortcut: tooltip(addLink),
		Icon: LinkIcon,
		'aria-haspopup': init['aria-haspopup'],
		'aria-keyshortcuts': getAriaKeyshortcuts(addLink),
	}),
);

export const media: MemoizedFn<(init: CreateInit) => MenuItem> = mem((init: CreateInit): MenuItem =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		registeredKey: MEDIA_INSERT_MENU_ITEM.key,
		name: 'media',
		Icon: ImageIcon,
	}),
);

export const imageUpload: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			name: 'image upload',
			Icon: ImageIcon,
		}),
);

export const mention: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: MENTION_MENU_ITEM.key,
			name: 'mention',
			Icon: MentionIcon,
			shortcut: '@',
			'aria-haspopup': init['aria-haspopup'],
			'aria-keyshortcuts': 'Shift+2 Space',
		}),
);

export const emoji: MemoizedFn<(init: CreateInit) => MenuItem> = mem((init: CreateInit): MenuItem =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		registeredKey: EMOJI_MENU_ITEM.key,
		name: 'emoji',
		Icon: EmojiIcon,
		shortcut: ':',
		'aria-haspopup': init['aria-haspopup'],
		'aria-keyshortcuts': 'Shift+;',
	}),
);

export const table: MemoizedFn<(init: CreateInit) => MenuItem> = mem((init: CreateInit): MenuItem =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		registeredKey: TABLE_MENU_ITEM.key,
		name: 'table',
		Icon: GridIcon,
		shortcut: tooltip(toggleTable),
		'aria-keyshortcuts': getAriaKeyshortcuts(toggleTable),
	}),
);

export const tableSelector: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: TABLE_MENU_ITEM.key,
			name: 'table selector',
			Icon: () => <ChevronDownIcon label="" color="currentColor" size="small" />,
		}),
);

export const layout: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: TWO_COLUMNS_LAYOUT_MENU_ITEM.key,
			name: 'layout',
			Icon: LayoutTwoColumnsIcon,
		}),
);

export const codeblock: MemoizedFn<(init: CreateInit & { shortcut?: string }) => MenuItem> = mem(
	(init: CreateInit & { shortcut?: string }): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: CODE_BLOCK_MENU_ITEM.key,
			name: 'codeblock',
			Icon: AngleBracketsIcon,
			shortcut: init.shortcut,
			'aria-keyshortcuts': getAriaKeyshortcuts(init.shortcut),
		}),
);

export const panel: MemoizedFn<(init: CreateInit & { shortcut?: string }) => MenuItem> = mem(
	(init: CreateInit & { shortcut?: string }): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: INFO_PANEL_MENU_ITEM.key,
			name: 'panel',
			Icon: InformationIcon,
			shortcut: init.shortcut,
			'aria-keyshortcuts': getAriaKeyshortcuts(init.shortcut),
		}),
);

export const blockquote: MemoizedFn<(init: CreateInit & { shortcut?: string }) => MenuItem> = mem(
	(init: CreateInit & { shortcut?: string }): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: BLOCKQUOTE_MENU_ITEM.key,
			name: 'blockquote',
			Icon: QuotationMarkIcon,
			shortcut: init.shortcut,
			'aria-keyshortcuts': 'Shift+. Space',
		}),
);

export const decision: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: DECISION_MENU_ITEM.key,
			name: 'decision',
			Icon: DecisionIcon,
			shortcut: '<>',
			'aria-keyshortcuts': 'Shift+, Shift+. Space',
		}),
);

export const horizontalrule: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: RULE_MENU_ITEM.key,
			name: 'horizontalrule',
			Icon: HorizontalRuleIcon,
			shortcut: '---',
			'aria-keyshortcuts': '- - -',
		}),
);

export const expand: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: EXPAND_MENU_ITEM.key,
			name: 'expand',
			Icon: (iconProps) => <ExpandNodeIcon label={iconProps.label} size="small" />,
		}),
);

export const date: MemoizedFn<(init: CreateInit) => MenuItem> = mem((init: CreateInit): MenuItem =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		registeredKey: DATE_MENU_ITEM.key,
		name: 'date',
		Icon: CalendarIcon,
		shortcut: '//',
		'aria-keyshortcuts': '/ / Enter',
	}),
);

export const placeholder: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: PLACEHOLDER_TEXT_MENU_ITEM.key,
			name: 'placeholder text',
			Icon: () => <FieldTextIcon label="" spacing="spacious" color="currentColor" />,
		}),
);

export const status: MemoizedFn<(init: CreateInit) => MenuItem> = mem(
	(init: CreateInit): MenuItem =>
		from({
			content: init.content,
			tooltipDescription: init.tooltipDescription,
			disabled: init.disabled,
			registeredKey: STATUS_MENU_ITEM.key,
			name: 'status',
			Icon: () => <LozengeIcon label="" color="currentColor" spacing="spacious" />,
		}),
);
