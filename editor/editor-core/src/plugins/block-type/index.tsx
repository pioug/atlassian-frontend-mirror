import React from 'react';
import { InjectedIntl } from 'react-intl';
import { blockquote, hardBreak, heading } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';
import ToolbarBlockType from './ui/ToolbarBlockType';
import WithPluginState from '../../ui/WithPluginState';
import { setBlockTypeWithAnalytics } from './commands';
import { BlockTypeNode, BlockTypePluginOptions, HeadingLevels } from './types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import * as keymaps from '../../keymaps';
import { IconHeading, IconQuote } from '../quick-insert/assets';
import {
  QuickInsertActionInsert,
  QuickInsertItem,
  QuickInsertItemId,
} from '@atlaskit/editor-common/provider-factory';
import { EditorState } from 'prosemirror-state';
import { messages } from './messages';
import { ToolbarSize } from '../../ui/Toolbar/types';

const headingPluginOptions = (
  { formatMessage }: InjectedIntl,
  isAllowed: boolean,
): Array<QuickInsertItem> => {
  if (!isAllowed) {
    return [];
  }

  return Array.from({ length: 6 }, (_v, idx) => {
    const level = (idx + 1) as HeadingLevels;
    const descriptionDescriptor = (messages as any)[
      `heading${level}Description`
    ];
    const keyshortcut = keymaps.tooltip(
      (keymaps as any)[`toggleHeading${level}`],
    );

    const id = `heading${level}` as QuickInsertItemId;

    return {
      id,
      title: formatMessage((messages as any)[id]),
      description: formatMessage(descriptionDescriptor),
      priority: 1300,
      keywords: [`h${level}`],
      keyshortcut,
      icon: () => <IconHeading level={level} />,
      action(insert: QuickInsertActionInsert, state: EditorState) {
        const tr = insert(state.schema.nodes.heading.createChecked({ level }));
        return addAnalytics(state, tr, {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
            newHeadingLevel: level,
          },
        });
      },
    };
  });
};

const blockquotePluginOptions = (
  { formatMessage }: InjectedIntl,
  isAllowed: boolean,
): Array<QuickInsertItem> => {
  if (!isAllowed) {
    return [];
  }

  return [
    {
      id: 'blockquote',
      title: formatMessage(messages.blockquote),
      description: formatMessage(messages.blockquoteDescription),
      priority: 1300,
      keyshortcut: keymaps.tooltip(keymaps.toggleBlockQuote),
      icon: () => <IconQuote />,
      action(insert, state) {
        const tr = insert(
          state.schema.nodes.blockquote.createChecked(
            {},
            state.schema.nodes.paragraph.createChecked(),
          ),
        );

        return addAnalytics(state, tr, {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
          },
        });
      },
    },
  ];
};

const blockTypePlugin = (options?: BlockTypePluginOptions): EditorPlugin => ({
  name: 'blockType',

  nodes() {
    const nodes: BlockTypeNode[] = [
      { name: 'heading', node: heading },
      { name: 'blockquote', node: blockquote },
      { name: 'hardBreak', node: hardBreak },
    ];

    if (options && options.allowBlockType) {
      const exclude = options.allowBlockType.exclude
        ? options.allowBlockType.exclude
        : [];
      return nodes.filter((node) => exclude.indexOf(node.name) === -1);
    }

    return nodes;
  },

  pmPlugins() {
    return [
      {
        name: 'blockType',
        plugin: ({ dispatch }) =>
          createPlugin(dispatch, options && options.lastNodeMustBeParagraph),
      },
      {
        name: 'blockTypeInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, featureFlags),
      },
      // Needs to be lower priority than editor-tables.tableEditing
      // plugin as it is currently swallowing right/down arrow events inside tables
      {
        name: 'blockTypeKeyMap',
        plugin: ({ schema, featureFlags }) =>
          keymapPlugin(schema, featureFlags),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
    eventDispatcher,
  }) {
    const isSmall =
      options && options.isUndoRedoButtonsEnabled
        ? toolbarSize < ToolbarSize.XXL
        : toolbarSize < ToolbarSize.XL;
    const boundSetBlockType = (name: string) =>
      setBlockTypeWithAnalytics(name, INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          pluginState: pluginKey,
        }}
        render={({ pluginState }) => {
          return (
            <ToolbarBlockType
              isSmall={isSmall}
              isDisabled={disabled}
              isReducedSpacing={isToolbarReducedSpacing}
              setBlockType={boundSetBlockType}
              pluginState={pluginState!}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
            />
          );
        }}
      />
    );
  },

  pluginsOptions: {
    quickInsert: (intl) => {
      const exclude =
        options && options.allowBlockType && options.allowBlockType.exclude
          ? options.allowBlockType.exclude
          : [];

      return [
        ...blockquotePluginOptions(intl, exclude.indexOf('blockquote') === -1),
        ...headingPluginOptions(intl, exclude.indexOf('heading') === -1),
      ];
    },
  },
});

export default blockTypePlugin;
export { pluginKey } from './pm-plugins/main';
export type { BlockTypeState } from './pm-plugins/main';
