import { type MutableRefObject } from 'react';

import mapValues from 'lodash/mapValues';
import { type IntlShape } from 'react-intl-next';

import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import { history, redo, undo } from '@atlaskit/editor-prosemirror/history';
import { keydownHandler, keymap } from '@atlaskit/editor-prosemirror/keymap';
import {
  DOMParser,
  type ResolvedPos,
  Schema,
  type Slice,
} from '@atlaskit/editor-prosemirror/model';
import {
  EditorState,
  Plugin,
  type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import {
  autocompletePlugin,
  jqlAstPlugin,
  jqlSyntaxHighlightingPlugin,
  richInlineNodesPlugin,
  validationTooltipPlugin,
} from '../plugins';
import { RICH_INLINE_NODE } from '../plugins/rich-inline-nodes/constants';
import { richInlineNodes } from '../plugins/rich-inline-nodes/nodes';
import { createNodeSpec } from '../plugins/rich-inline-nodes/util/create-node-spec';
import { type PortalActions } from '../ui/jql-editor-portal-provider/types';
import { getFragmentText } from '../utils/document-text';
import { splitTextByNewLine } from '../utils/split-text-by-new-line';

const createMarkWithStyle = (tokenType: string) => {
  const mark = document.createElement('span');
  mark.className = `mark-token-${tokenType}`;
  mark.setAttribute('data-token-type', tokenType);
  mark.setAttribute('spellcheck', 'false');
  return mark;
};

type Nodes = 'doc' | 'paragraph' | 'text' | keyof typeof richInlineNodes;
type Marks = 'token' | 'cursor';

export const JQLEditorSchema = new Schema<Nodes, Marks>({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: {
      content: `(text|${RICH_INLINE_NODE})*`,
      toDOM: () => ['p', { spellcheck: 'false' }, 0],
      parseDOM: [{ tag: 'p' }],
    },
    text: {},
    ...mapValues(richInlineNodes, (spec, name) =>
      createNodeSpec(name, spec.attrs),
    ),
  },
  marks: {
    token: {
      toDOM: ({ attrs }) => createMarkWithStyle(attrs.tokenType),
      attrs: {
        tokenType: {},
      },
    },
    cursor: {
      toDOM: () => {
        return document.createElement('span');
      },
    },
  },
});

const domParser = DOMParser.fromSchema(JQLEditorSchema);

/**
 * Emulate the behaviour of the default https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer but
 * preserves consecutive empty block nodes.
 */
export const clipboardTextSerializer = (slice: Slice) => {
  return getFragmentText(slice.content, 0, slice.content.size);
};

/**
 * Emulate the behaviour of the default https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextParser but
 * preserves consecutive empty lines.
 */
export const clipboardTextParser = (
  text: string,
  $context: ResolvedPos,
): Slice => {
  const dom = document.createElement('div');
  // Split each line of text and wrap each in a p tag.
  splitTextByNewLine(text).forEach(block => {
    dom.appendChild(document.createElement('p')).textContent = block;
  });
  return domParser.parseSlice(dom, {
    context: $context,
    preserveWhitespace: true,
  });
};

export const defaultEditorState = EditorState.create({
  schema: JQLEditorSchema,
});

export type JQLEditorSchemaType = typeof JQLEditorSchema;

// @types/prosemirror-commands@1.0.1 does not export Command and Keymap types
// TODO: update to Command<JQLEditorSchemaType> and Keymap<JQLEditorSchemaType> if types are bumped to a newer version

export type JQLEditorCommand = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView,
) => boolean;

export type JQLEditorKeymap = {
  [key: string]: JQLEditorCommand;
};

export const configurePlugins = (
  editorState: EditorState,
  onSearchCommand: JQLEditorCommand | undefined,
  intlRef: MutableRefObject<IntlShape>,
  mainId: string,
  portalActions: PortalActions | void,
  enableRichInlineNodes: boolean,
): EditorState => {
  return editorState.reconfigure({
    plugins: [
      history(),
      // Other plugins rely on having AST as part of the state during a transaction, this plugin should be kept first
      jqlAstPlugin(intlRef),
      jqlSyntaxHighlightingPlugin(),
      ...(portalActions !== undefined
        ? [
            autocompletePlugin(portalActions, enableRichInlineNodes),
            ...(enableRichInlineNodes
              ? [richInlineNodesPlugin(portalActions)]
              : []),
          ]
        : []),
      validationTooltipPlugin(mainId),
      // Keeping these at the bottom allows plugins to define custom key bindings to override default behavior
      keymap({
        'Mod-z': undo,
        'Mod-Shift-z': redo,
        'Mod-y': redo,
        // Mimic default Enter behavior in PM's base keymap, allowing to insert new lines even when autocomplete is open
        'Shift-Enter': baseKeymap.Enter,
      }),
      ...(!onSearchCommand
        ? []
        : [
            keymapNoRepeat({
              'Mod-Enter': onSearchCommand,
              Enter: onSearchCommand,
            }),
          ]),
      keymap(baseKeymap),
    ],
  });
};

const noopCommand = () => true;

function keymapNoRepeat(bindings: JQLEditorKeymap) {
  const handler = keydownHandler(bindings);

  const proxyBindings = mapValues(bindings, () => noopCommand);
  const proxyHandler = keydownHandler(proxyBindings);

  return new Plugin({
    props: {
      handleKeyDown: (view, event) => {
        if (event.repeat) {
          return proxyHandler(view, event);
        }
        return handler(view, event);
      },
    },
  });
}
