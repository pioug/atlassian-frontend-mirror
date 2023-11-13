/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';

import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import EditorImageIcon from '@atlaskit/icon/glyph/editor/image';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DateIcon from '@atlaskit/icon/glyph/editor/date';
import StatusIcon from '@atlaskit/icon/glyph/status';
import ExpandNodeIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import PlaceholderTextIcon from '@atlaskit/icon/glyph/media-services/text';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';

import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { tooltip, addLink, toggleTable } from '@atlaskit/editor-common/keymaps';
import { shallowEquals } from './shallow-equals';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';

interface ItemInit {
  content: string;
  tooltipDescription?: string;
  disabled: boolean;
  name: string;
  shortcut?: string;
  Icon: React.ComponentType<{ label: string }>;
  'aria-label'?: React.AriaAttributes['aria-label'];
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
  'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
}

const from = (init: ItemInit): MenuItem => ({
  content: init.content,
  tooltipDescription: init.tooltipDescription,
  value: { name: init.name },
  elemBefore: <init.Icon label={init.content} />,
  elemAfter: init.shortcut ? (
    <div css={shortcutStyle}>{init.shortcut}</div>
  ) : undefined,
  'aria-label': init.shortcut
    ? init.content + ' ' + init.shortcut
    : init.content,
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

const mem = <TFunc extends (...args: any[]) => any>(fn: TFunc): TFunc =>
  memoizeOne(fn, shallowEquals) as any;

export const action = mem((init: CreateInit) => {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'action',
    shortcut: '[]',
    Icon: TaskIcon,
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
    Icon: EditorImageIcon,
  }),
);

export const imageUpload = mem((init: CreateInit) =>
  from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'image upload',
    Icon: EditorImageIcon,
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
    Icon: TableIcon,
    shortcut: tooltip(toggleTable),
    'aria-keyshortcuts': getAriaKeyshortcuts(toggleTable),
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
    Icon: CodeIcon,
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
    Icon: InfoIcon,
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
    Icon: QuoteIcon,
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
    Icon: DateIcon,
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
    Icon: () => <EditorMoreIcon label="" />,
  }),
);
