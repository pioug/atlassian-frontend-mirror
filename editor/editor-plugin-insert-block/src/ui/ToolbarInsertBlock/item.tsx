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
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { type NewCoreIconProps } from '@atlaskit/icon';
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
	shortcut?: string;
	tooltipDescription?: string;
}

const from = (init: ItemInit): MenuItem => ({
	content: init.content,
	tooltipDescription: init.tooltipDescription,
	value: { name: init.name },
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

export const action = mem((init: CreateInit) => {
	return from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'action',
		shortcut: '[]',
		Icon: () => <TaskIcon label="" color="currentColor" spacing="spacious" />,
		'aria-keyshortcuts': '[ ] Space',
	});
});

export const link = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'link',
		shortcut: tooltip(addLink),
		Icon: LinkIcon,
		'aria-haspopup': init['aria-haspopup'],
		'aria-keyshortcuts': getAriaKeyshortcuts(addLink),
	}),
);

export const media = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'media',
		Icon: ImageIcon,
	}),
);

export const imageUpload = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'image upload',
		Icon: ImageIcon,
	}),
);

export const mention = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'mention',
		Icon: MentionIcon,
		shortcut: '@',
		'aria-haspopup': init['aria-haspopup'],
		'aria-keyshortcuts': 'Shift+2 Space',
	}),
);

export const emoji = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'emoji',
		Icon: EmojiIcon,
		shortcut: ':',
		'aria-haspopup': init['aria-haspopup'],
		'aria-keyshortcuts': 'Shift+;',
	}),
);

export const table = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'table',
		Icon: GridIcon,
		shortcut: tooltip(toggleTable),
		'aria-keyshortcuts': getAriaKeyshortcuts(toggleTable),
	}),
);

export const tableSelector = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'table selector',
		Icon: () => <ChevronDownIcon label="" color="currentColor" size="small" />,
	}),
);

export const layout = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'layout',
		Icon: LayoutTwoColumnsIcon,
	}),
);

export const codeblock = mem((init: CreateInit & { shortcut?: string }) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'codeblock',
		Icon: AngleBracketsIcon,
		shortcut: init.shortcut,
		'aria-keyshortcuts': getAriaKeyshortcuts(init.shortcut),
	}),
);

export const panel = mem((init: CreateInit & { shortcut?: string }) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'panel',
		Icon: InformationIcon,
		shortcut: init.shortcut,
		'aria-keyshortcuts': getAriaKeyshortcuts(init.shortcut),
	}),
);

export const blockquote = mem((init: CreateInit & { shortcut?: string }) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'blockquote',
		Icon: QuotationMarkIcon,
		shortcut: init.shortcut,
		'aria-keyshortcuts': 'Shift+. Space',
	}),
);

export const decision = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'decision',
		Icon: DecisionIcon,
		shortcut: '<>',
		'aria-keyshortcuts': 'Shift+, Shift+. Space',
	}),
);

export const horizontalrule = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'horizontalrule',
		Icon: HorizontalRuleIcon,
		shortcut: '---',
		'aria-keyshortcuts': '- - -',
	}),
);

export const expand = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'expand',
		Icon: (iconProps) => <ExpandNodeIcon label={iconProps.label} size="small" />,
	}),
);

export const date = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'date',
		Icon: CalendarIcon,
		shortcut: '//',
		'aria-keyshortcuts': '/ / Enter',
	}),
);

export const placeholder = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'placeholder text',
		Icon: () => <FieldTextIcon label="" spacing="spacious" color="currentColor" />,
	}),
);

export const status = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'status',
		Icon: () => <LozengeIcon label="" color="currentColor" spacing="spacious" />,
	}),
);
