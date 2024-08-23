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
import AngleBracketsIcon from '@atlaskit/icon/core/migration/angle-brackets--editor-code';
import CalendarIcon from '@atlaskit/icon/core/migration/calendar--editor-date';
import CheckboxCheckedIcon from '@atlaskit/icon/core/migration/checkbox-checked--editor-task';
import DecisionIcon from '@atlaskit/icon/core/migration/decision--editor-decision';
import EmojiIcon from '@atlaskit/icon/core/migration/emoji--editor-emoji';
import GridIcon from '@atlaskit/icon/core/migration/grid--editor-table';
import ImageIcon from '@atlaskit/icon/core/migration/image--editor-image';
import InformationIcon from '@atlaskit/icon/core/migration/information--editor-info';
import LinkIcon from '@atlaskit/icon/core/migration/link--editor-link';
import MentionIcon from '@atlaskit/icon/core/migration/mention--editor-mention';
import QuotationMarkIcon from '@atlaskit/icon/core/migration/quotation-mark--quote';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import PlaceholderTextIcon from '@atlaskit/icon/glyph/media-services/text';
import StatusIcon from '@atlaskit/icon/glyph/status';
import type Icon from '@atlaskit/icon/UNSAFE_base-new';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import ExpandNodeIcon from '@atlaskit/icon/utility/migration/chevron-right--chevron-right-circle';

import { shallowEquals } from './shallow-equals';

interface ItemInit {
	content: string;
	tooltipDescription?: string;
	disabled: boolean;
	name: string;
	shortcut?: string;
	Icon: React.ComponentType<
		Omit<
			React.ComponentProps<typeof Icon>,
			'dangerouslySetGlyph' | 'type' | 'LEGACY_fallbackIcon'
		> & { label: string }
	>;
	'aria-label'?: React.AriaAttributes['aria-label'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
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
	content: string;
	disabled: boolean;
	tooltipDescription?: string;
	'aria-label'?: React.AriaAttributes['aria-label'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
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
		Icon: CheckboxCheckedIcon,
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
		Icon: () => <ChevronDownIcon label="" color="currentColor" />,
	}),
);

export const layout = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'layout',
		Icon: LayoutTwoEqualIcon,
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
		Icon: ExpandNodeIcon,
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
		Icon: () => <PlaceholderTextIcon label="" />,
	}),
);

export const status = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'status',
		Icon: StatusIcon,
	}),
);

export const more = mem((init: CreateInit) =>
	from({
		content: init.content,
		tooltipDescription: init.tooltipDescription,
		disabled: init.disabled,
		name: 'macro',
		Icon: () => <ShowMoreHorizontalIcon label="" color="currentColor" />,
	}),
);
