import React from 'react';
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

import { Shortcut } from '../../../../ui/styles';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { tooltip, addLink, toggleTable } from '../../../../keymaps';
import { shallowEquals } from './shallow-equals';

interface ItemInit {
  content: string;
  tooltipDescription?: string;
  disabled: boolean;
  name: string;
  shortcut?: string;
  Icon: React.ComponentType<{ label: string }>;
}

const from = (init: ItemInit): MenuItem => ({
  content: init.content,
  tooltipDescription: init.tooltipDescription,
  value: { name: init.name },
  elemBefore: <init.Icon label={init.content} />,
  elemAfter: init.shortcut ? <Shortcut>{init.shortcut}</Shortcut> : undefined,
  shortcut: init.shortcut,
  isDisabled: init.disabled,
});

export interface CreateInit {
  content: string;
  disabled: boolean;
  tooltipDescription?: string;
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
