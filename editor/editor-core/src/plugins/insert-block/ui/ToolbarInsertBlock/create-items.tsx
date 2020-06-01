import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import memoizeOne from 'memoize-one';
import { Schema } from 'prosemirror-model';

import { EmojiProvider } from '@atlaskit/emoji/resource';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import EditorImageIcon from '@atlaskit/icon/glyph/editor/image';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
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

import { messages } from './messages';
import { BlockType } from '../../../block-type/types';
import { Shortcut } from '../../../../ui/styles';
import {
  addLink,
  toggleTable,
  tooltip,
  ToolTipContent,
} from '../../../../keymaps';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { MacroProvider } from '../../../macro';
import { sortItems } from './sort-items';

const blockTypeIcons = {
  codeblock: CodeIcon,
  panel: InfoIcon,
  blockquote: QuoteIcon,
};

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
  expandEnabled?: boolean;
  insertMenuItems?: MenuItem[];
  macroProvider?: MacroProvider | null;
  emojiProvider?: Promise<EmojiProvider>;
  schema: Schema;
  numberOfButtons: number;
  formatMessage: InjectedIntlProps['intl']['formatMessage'];
  handleButtonRef(ref: HTMLElement): void;
  getShortcutBlock(blockType: BlockType): string | undefined;
}

export interface BlockMenuItem extends MenuItem {
  title: JSX.Element | null;
}

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
    macroProvider,
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
    handleButtonRef,
    getShortcutBlock,
  } = config;
  let items: MenuItem[] = [];

  if (actionSupported) {
    const labelAction = formatMessage(messages.action);
    items.push({
      content: labelAction,
      value: { name: 'action' },
      elemBefore: <TaskIcon label={labelAction} />,
      elemAfter: <Shortcut>{'[]'}</Shortcut>,
      shortcut: '[]',
    });
  }

  if (linkSupported) {
    const labelLink = formatMessage(messages.link);
    const shortcutLink = tooltip(addLink);
    items.push({
      content: labelLink,
      value: { name: 'link' },
      isDisabled: linkDisabled,
      elemBefore: <LinkIcon label={labelLink} />,
      elemAfter: shortcutLink ? <Shortcut>{shortcutLink}</Shortcut> : undefined,
      shortcut: shortcutLink,
    });
  }
  if (mediaSupported && mediaUploadsEnabled) {
    const labelFilesAndImages = formatMessage(messages.filesAndImages);
    items.push({
      content: labelFilesAndImages,
      value: { name: 'media' },
      elemBefore: <EditorImageIcon label={labelFilesAndImages} />,
    });
  }
  if (imageUploadSupported) {
    const labelImage = formatMessage(messages.image);
    items.push({
      content: labelImage,
      value: { name: 'image upload' },
      isDisabled: !imageUploadEnabled,
      elemBefore: <EditorImageIcon label={labelImage} />,
    });
  }
  if (mentionsSupported) {
    const labelMention = formatMessage(messages.mention);
    items.push({
      content: labelMention,
      value: { name: 'mention' },
      isDisabled: !isTypeAheadAllowed,
      elemBefore: <MentionIcon label={labelMention} />,
      elemAfter: <Shortcut>@</Shortcut>,
      shortcut: '@',
    });
  }
  if (emojiProvider) {
    const labelEmoji = formatMessage(messages.emoji);
    items.push({
      content: labelEmoji,
      value: { name: 'emoji' },
      isDisabled: emojiDisabled || !isTypeAheadAllowed,
      elemBefore: <EmojiIcon label={labelEmoji} />,
      handleRef: handleButtonRef,
      elemAfter: <Shortcut>:</Shortcut>,
      shortcut: ':',
    });
  }
  if (tableSupported) {
    const labelTable = formatMessage(messages.table);
    const shortcutTable = tooltip(toggleTable);
    items.push({
      content: labelTable,
      value: { name: 'table' },
      elemBefore: <TableIcon label={labelTable} />,
      elemAfter: shortcutTable ? (
        <Shortcut>{shortcutTable}</Shortcut>
      ) : (
        undefined
      ),
      shortcut: shortcutTable,
    });
  }
  if (layoutSectionEnabled) {
    const labelColumns = formatMessage(messages.columns);
    items.push({
      content: labelColumns,
      value: { name: 'layout' },
      elemBefore: <LayoutTwoEqualIcon label={labelColumns} />,
    });
  }
  if (availableWrapperBlockTypes) {
    availableWrapperBlockTypes.forEach(blockType => {
      const BlockTypeIcon =
        blockTypeIcons[blockType.name as keyof typeof blockTypeIcons];
      const labelBlock = formatMessage(blockType.title);
      const shortcutBlock = getShortcutBlock(blockType);
      items.push({
        content: labelBlock,
        value: blockType,
        elemBefore: <BlockTypeIcon label={labelBlock} />,
        elemAfter: shortcutBlock ? (
          <Shortcut>{shortcutBlock}</Shortcut>
        ) : (
          undefined
        ),
        shortcut: shortcutBlock,
      });
    });
  }
  if (decisionSupported) {
    const labelDecision = formatMessage(messages.decision);
    items.push({
      content: labelDecision,
      value: { name: 'decision' },
      elemBefore: <DecisionIcon label={labelDecision} />,
      elemAfter: <Shortcut>{'<>'}</Shortcut>,
      shortcut: '<>',
    });
  }
  if (horizontalRuleEnabled && schema.nodes.rule) {
    const labelHorizontalRule = formatMessage(messages.horizontalRule);
    items.push({
      content: labelHorizontalRule,
      value: { name: 'horizontalrule' },
      elemBefore: <HorizontalRuleIcon label={labelHorizontalRule} />,
      elemAfter: <Shortcut>---</Shortcut>,
      shortcut: '---',
    });
  }

  if (expandEnabled && schema.nodes.expand) {
    const labelExpand = formatMessage(messages.expand);
    items.push({
      content: labelExpand,
      value: { name: 'expand' },
      elemBefore: <ExpandNodeIcon label={labelExpand} />,
    });
  }

  if (dateEnabled) {
    const labelDate = formatMessage(messages.date);
    items.push({
      content: labelDate,
      value: { name: 'date' },
      elemBefore: <DateIcon label={labelDate} />,
      elemAfter: <Shortcut>//</Shortcut>,
      shortcut: '//',
    });
  }

  if (placeholderTextEnabled) {
    const labelPlaceholderText = formatMessage(messages.placeholderText);
    items.push({
      content: labelPlaceholderText,
      value: { name: 'placeholder text' },
      elemBefore: <PlaceholderTextIcon label={labelPlaceholderText} />,
    });
  }

  if (nativeStatusSupported) {
    const labelStatus = formatMessage(messages.status);
    items.push({
      content: labelStatus,
      value: { name: 'status' },
      elemBefore: <StatusIcon label={labelStatus} />,
    });
  }

  if (insertMenuItems) {
    items = items.concat(insertMenuItems);
    // keeping this here for backwards compatibility so confluence
    // has time to implement this button before it disappears.
    // Should be safe to delete soon. If in doubt ask Leandro Lemos (llemos)
  } else if (typeof macroProvider !== 'undefined' && macroProvider) {
    const labelViewMore = formatMessage(messages.viewMore);
    items.push({
      content: labelViewMore,
      value: { name: 'macro' },
      elemBefore: <EditorMoreIcon label={labelViewMore} />,
    });
  }

  const buttonItems = items.slice(0, numberOfButtons).map(button => ({
    ...button,
    title: (
      <ToolTipContent
        description={button.content}
        shortcutOverride={button.shortcut}
      />
    ),
  }));

  const labelInsertMenu = formatMessage(messages.insertMenu);
  const dropDownItemTitle = (
    <ToolTipContent description={labelInsertMenu} shortcutOverride="/" />
  );

  const dropdownItems = sortItems(items.slice(numberOfButtons)).map(item => ({
    ...item,
    title: dropDownItemTitle,
  }));

  return [buttonItems, dropdownItems] as const;
};

const shallowEquals = (
  [aRaw]: ReadonlyArray<unknown>,
  [bRaw]: ReadonlyArray<unknown>,
): boolean => {
  const a = aRaw as CreateItemsConfig;
  const b = bRaw as CreateItemsConfig;

  return Object.keys(a).every(key => {
    const k = (key as unknown) as keyof CreateItemsConfig;
    return a[k] === b[k];
  });
};

export const createItems = memoizeOne(createInsertBlockItems, shallowEquals);
