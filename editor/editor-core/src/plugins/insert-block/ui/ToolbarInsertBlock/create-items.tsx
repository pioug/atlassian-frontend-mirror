import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import memoize from 'lodash/memoize';
import memoizeOne from 'memoize-one';
import { Schema } from 'prosemirror-model';

import { EmojiProvider } from '@atlaskit/emoji/resource';

import { messages } from './messages';
import { messages as blockTypeMessages } from '../../../block-type/messages';

import { BlockType } from '../../../block-type/types';
import { ToolTipContent } from '../../../../keymaps';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { MacroProvider } from '../../../macro';
import { sortItems } from './sort-items';
import {
  action,
  link,
  media,
  mention,
  emoji,
  table,
  layout,
  codeblock,
  panel,
  blockquote,
  decision,
  horizontalrule,
  expand,
  date,
  placeholder,
  status,
  more,
  imageUpload,
} from './item';
import { shallowEquals } from './shallow-equals';

export interface CreateItemsConfig {
  isTypeAheadAllowed?: boolean;
  tableSupported?: boolean;
  mediaUploadsEnabled?: boolean;
  mediaSupported?: boolean;
  imageUploadSupported?: boolean;
  imageUploadEnabled?: boolean;
  mentionsSupported?: boolean;
  availableWrapperBlockTypes?: BlockType[];
  actionSupported?: boolean;
  decisionSupported?: boolean;
  linkSupported?: boolean;
  linkDisabled?: boolean;
  emojiDisabled?: boolean;
  nativeStatusSupported?: boolean;
  dateEnabled?: boolean;
  placeholderTextEnabled?: boolean;
  horizontalRuleEnabled?: boolean;
  layoutSectionEnabled?: boolean;
  showElementBrowserLink?: boolean;
  expandEnabled?: boolean;
  insertMenuItems?: MenuItem[];
  macroProvider?: MacroProvider | null;
  emojiProvider?: Promise<EmojiProvider>;
  schema: Schema;
  numberOfButtons: number;
  formatMessage: InjectedIntlProps['intl']['formatMessage'];
  isNewMenuEnabled?: boolean;
}

export interface BlockMenuItem extends MenuItem {
  title: JSX.Element | null;
}

const buttonToItem: (button: MenuItem) => BlockMenuItem = memoize(
  (button: MenuItem): BlockMenuItem => ({
    ...button,
    title: (
      <ToolTipContent
        description={button.content}
        shortcutOverride={button.shortcut}
      />
    ),
  }),
);

const buttonToDropdownItem = memoizeOne((title: string): ((
  button: MenuItem,
) => BlockMenuItem) =>
  memoize(
    (button: MenuItem): BlockMenuItem => ({
      ...button,
      title: <ToolTipContent description={title} shortcutOverride="/" />,
    }),
  ),
);

const createInsertBlockItems = (
  config: CreateItemsConfig,
): Readonly<[BlockMenuItem[], BlockMenuItem[]]> => {
  const {
    isTypeAheadAllowed,
    tableSupported,
    mediaUploadsEnabled,
    mediaSupported,
    imageUploadSupported,
    imageUploadEnabled,
    mentionsSupported,
    availableWrapperBlockTypes,
    actionSupported,
    decisionSupported,
    showElementBrowserLink,
    linkSupported,
    linkDisabled,
    emojiDisabled,
    emojiProvider,
    nativeStatusSupported,
    insertMenuItems,
    dateEnabled,
    placeholderTextEnabled,
    horizontalRuleEnabled,
    layoutSectionEnabled,
    expandEnabled,
    numberOfButtons,
    schema,
    formatMessage,
    isNewMenuEnabled,
  } = config;

  const items: MenuItem[] = [];

  if (actionSupported) {
    items.push(
      action({
        content: formatMessage(messages.action),
        tooltipDescription: formatMessage(messages.actionDescription),
        disabled: false,
      }),
    );
  }

  if (linkSupported) {
    items.push(
      link({
        content: formatMessage(messages.link),
        tooltipDescription: formatMessage(messages.linkDescription),
        disabled: !!linkDisabled,
      }),
    );
  }

  if (mediaSupported && mediaUploadsEnabled) {
    items.push(
      media({
        content: formatMessage(messages.filesAndImages),
        tooltipDescription: formatMessage(messages.filesAndImagesDescription),
        disabled: false,
      }),
    );
  }

  if (imageUploadSupported) {
    items.push(
      imageUpload({
        content: formatMessage(messages.image),
        disabled: !imageUploadEnabled,
      }),
    );
  }

  if (mentionsSupported) {
    items.push(
      mention({
        content: formatMessage(messages.mention),
        tooltipDescription: formatMessage(messages.mentionDescription),
        disabled: !isTypeAheadAllowed,
      }),
    );
  }

  if (emojiProvider) {
    items.push(
      emoji({
        content: formatMessage(messages.emoji),
        tooltipDescription: formatMessage(messages.emojiDescription),
        disabled: emojiDisabled || !isTypeAheadAllowed,
      }),
    );
  }

  if (tableSupported) {
    items.push(
      table({
        content: formatMessage(messages.table),
        tooltipDescription: formatMessage(messages.tableDescription),
        disabled: false,
      }),
    );
  }

  if (layoutSectionEnabled) {
    const labelColumns = formatMessage(messages.columns);
    items.push(
      layout({
        content: labelColumns,
        tooltipDescription: formatMessage(messages.columnsDescription),
        disabled: false,
      }),
    );
  }

  const blockTypes = availableWrapperBlockTypes || [];
  const codeblockData = blockTypes.find((type) => type.name === 'codeblock');
  const panelData = blockTypes.find((type) => type.name === 'panel');
  const blockquoteData = blockTypes.find((type) => type.name === 'blockquote');

  if (codeblockData) {
    items.push(
      codeblock({
        content: formatMessage(codeblockData.title),
        tooltipDescription: formatMessage(
          blockTypeMessages.codeblockDescription,
        ),
        disabled: false,
        shortcut: '```',
      }),
    );
  }

  if (panelData) {
    items.push(
      panel({
        content: formatMessage(panelData.title),
        tooltipDescription: formatMessage(
          blockTypeMessages.infoPanelDescription,
        ),
        disabled: false,
      }),
    );
  }

  if (blockquoteData) {
    items.push(
      blockquote({
        content: formatMessage(blockquoteData.title),
        tooltipDescription: formatMessage(
          blockTypeMessages.blockquoteDescription,
        ),
        disabled: false,
        shortcut: '>',
      }),
    );
  }

  if (decisionSupported) {
    items.push(
      decision({
        content: formatMessage(messages.decision),
        tooltipDescription: formatMessage(messages.decisionDescription),
        disabled: false,
      }),
    );
  }

  if (horizontalRuleEnabled && schema.nodes.rule) {
    items.push(
      horizontalrule({
        content: formatMessage(messages.horizontalRule),
        tooltipDescription: formatMessage(messages.horizontalRuleDescription),
        disabled: false,
      }),
    );
  }

  if (expandEnabled && schema.nodes.expand) {
    items.push(
      expand({
        content: formatMessage(messages.expand),
        tooltipDescription: formatMessage(messages.expandDescription),
        disabled: false,
      }),
    );
  }

  if (dateEnabled) {
    const labelDate = formatMessage(messages.date);
    items.push(
      date({
        content: labelDate,
        tooltipDescription: formatMessage(messages.dateDescription),
        disabled: false,
      }),
    );
  }

  if (placeholderTextEnabled) {
    items.push(
      placeholder({
        content: formatMessage(messages.placeholderText),
        disabled: false,
      }),
    );
  }

  if (nativeStatusSupported) {
    const labelStatus = formatMessage(messages.status);
    items.push(
      status({
        content: labelStatus,
        tooltipDescription: formatMessage(messages.statusDescription),
        disabled: false,
      }),
    );
  }

  if (insertMenuItems) {
    items.push(...insertMenuItems);
  }

  if (showElementBrowserLink) {
    items.push(
      more({
        content: formatMessage(messages.viewMore),
        disabled: false,
      }),
    );
  }

  const buttonItems = items.slice(0, numberOfButtons).map(buttonToItem);

  const remainingItems = items.slice(numberOfButtons);
  const dropdownItems = (!isNewMenuEnabled
    ? sortItems(remainingItems)
    : remainingItems
  ).map(buttonToDropdownItem(formatMessage(messages.insertMenu)));

  return [buttonItems, dropdownItems] as const;
};

export const createItems = memoizeOne(createInsertBlockItems, shallowEquals);
