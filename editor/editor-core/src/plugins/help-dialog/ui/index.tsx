/** @jsx jsx */
import { useCallback, useEffect } from 'react';
import { jsx } from '@emotion/react';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl-next';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { browser } from '@atlaskit/editor-common/utils';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AkModalDialog, {
  ModalTransition,
  useModal,
} from '@atlaskit/modal-dialog';
import {
  header,
  footer,
  contentWrapper,
  line,
  content,
  row,
  codeSm,
  codeMd,
  codeLg,
  title,
  column,
  dialogHeader,
} from './styles';
import {
  navToFloatingToolbar,
  navToEditorToolbar,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleSubscript,
  toggleSuperscript,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleHeading4,
  toggleHeading5,
  toggleHeading6,
  toggleOrderedList,
  insertRule,
  addLink,
  setNormalText,
  alignLeft,
  clearFormatting,
  undo,
  redo,
  pastePlainText,
  addInlineComment,
  toggleTaskItemCheckbox,
  toggleCode,
  openHelp,
  toggleBulletList,
  toggleBlockQuote,
} from '@atlaskit/editor-common/keymaps';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import ToolbarButton from '../../../ui/ToolbarButton';
import {
  toolbarMessages,
  listMessages,
} from '@atlaskit/editor-common/messages';
import { messages as insertBlockMessages } from '../../insert-block/ui/ToolbarInsertBlock/messages';
import { messages as blockTypeMessages } from '../../block-type/messages';
import { messages as undoRedoMessages } from '../../undo-redo/messages';
import { alignmentMessages } from '../../../ui/Alignment/messages';
import { closeHelpCommand } from '../commands';
import { annotationMessages } from '../../annotation/toolbar';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type helpDialogPlugin from '..';

const messages = defineMessages({
  editorHelp: {
    id: 'fabric.editor.editorHelp',
    defaultMessage: 'Editor help',
    description: 'Title of editor help dialog.',
  },
  helpDialogTips: {
    id: 'fabric.editor.helpDialogTips',
    defaultMessage: 'Press {keyMap} to quickly open this dialog at any time',
    description: 'Hint about how to open a dialog quickly using a shortcut.',
  },
  keyboardShortcuts: {
    id: 'fabric.editor.keyboardShortcuts',
    defaultMessage: 'Keyboard shortcuts',
    description: '',
  },
  markdown: {
    id: 'fabric.editor.markdown',
    defaultMessage: 'Markdown',
    description: 'It is a name of popular markup language.',
  },
  pastePlainText: {
    id: 'fabric.editor.pastePlainText',
    defaultMessage: 'Paste plain text',
    description: '',
  },
  CheckUncheckActionItem: {
    id: 'fabric.editor.checkUncheckActionItem',
    defaultMessage: 'Toggle action item',
    description: 'For Check/Uncheck Action item use shortcut',
  },
  altText: {
    id: 'fabric.editor.altText',
    defaultMessage: 'Alt text',
    description: 'Alternative text for image.',
  },
  closeHelpDialog: {
    id: 'fabric.editor.closeHelpDialog',
    defaultMessage: 'Close help dialog',
    description: '',
  },
  // TODO: Move it inside quick insert plugin
  quickInsert: {
    id: 'fabric.editor.quickInsert',
    defaultMessage: 'Quick insert',
    description: 'Name of a feature, which let you insert items quickly.',
  },
});

export interface Format {
  name: string;
  type: string;
  keymap?: Function;
  autoFormatting?: Function;
  imageEnabled?: boolean;
}

const navigationKeymaps: (intl: IntlShape) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(toolbarMessages.navigateToEditorToolbar),
    type: 'navigation',
    keymap: () => navToEditorToolbar,
  },
  {
    name: formatMessage(toolbarMessages.navigateToFloatingToolbar),
    type: 'navigation',
    keymap: () => navToFloatingToolbar,
  },
];

export const formatting: (intl: IntlShape) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(toolbarMessages.bold),
    type: 'strong',
    keymap: () => toggleBold,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          **
          <FormattedMessage {...toolbarMessages.bold} />
          **
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarMessages.italic),
    type: 'em',
    keymap: () => toggleItalic,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          *<FormattedMessage {...toolbarMessages.italic} />*
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarMessages.underline),
    type: 'underline',
    keymap: () => toggleUnderline,
  },
  {
    name: formatMessage(toolbarMessages.strike),
    type: 'strike',
    keymap: () => toggleStrikethrough,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          ~~
          <FormattedMessage {...toolbarMessages.strike} />
          ~~
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarMessages.subscript),
    type: 'subsup',
    keymap: () => toggleSubscript,
  },
  {
    name: formatMessage(toolbarMessages.superscript),
    type: 'subsup',
    keymap: () => toggleSuperscript,
  },
  {
    name: formatMessage(blockTypeMessages.heading1),
    type: 'heading',
    keymap: () => toggleHeading1,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>#</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading2),
    type: 'heading',
    keymap: () => toggleHeading2,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>##</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading3),
    type: 'heading',
    keymap: () => toggleHeading3,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>###</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading4),
    type: 'heading',
    keymap: () => toggleHeading4,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>####</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading5),
    type: 'heading',
    keymap: () => toggleHeading5,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>#####</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading6),
    type: 'heading',
    keymap: () => toggleHeading6,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>######</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.normal),
    type: 'paragraph',
    keymap: () => setNormalText,
  },
  {
    name: formatMessage(listMessages.orderedList),
    type: 'orderedList',
    keymap: () => toggleOrderedList,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>1.</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(listMessages.unorderedList),
    type: 'bulletList',
    keymap: () => toggleBulletList,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>*</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.blockquote),
    type: 'blockquote',
    keymap: () => toggleBlockQuote,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>{'>'}</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.codeblock),
    type: 'codeBlock',
    autoFormatting: () => (
      <span>
        <span css={codeLg}>```</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.horizontalRule),
    type: 'rule',
    keymap: () => insertRule,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>---</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.link),
    type: 'link',
    keymap: () => addLink,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          [<FormattedMessage {...insertBlockMessages.link} />
          ](http://a.com)
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarMessages.code),
    type: 'code',
    keymap: () => toggleCode,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          `<FormattedMessage {...toolbarMessages.code} />`
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.action),
    type: 'taskItem',
    autoFormatting: () => (
      <span>
        <span css={codeSm}>[]</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.decision),
    type: 'decisionItem',
    autoFormatting: () => (
      <span>
        <span css={codeSm}>&lt;&gt;</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.emoji),
    type: 'emoji',
    autoFormatting: () => (
      <span>
        <span css={codeLg}>:</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.mention),
    type: 'mention',
    autoFormatting: () => (
      <span>
        <span css={codeLg}>@</span>
      </span>
    ),
  },
  {
    name: formatMessage(alignmentMessages.alignLeft),
    type: 'alignment',
    keymap: () => alignLeft,
  },
  {
    name: formatMessage(alignmentMessages.alignRight),
    type: 'alignment',
  },
];
const shortcutNamesWithoutKeymap: string[] = [
  'emoji',
  'mention',
  'quickInsert',
];

const otherFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
  {
    name: formatMessage(toolbarMessages.clearFormatting),
    type: 'clearFormatting',
    keymap: () => clearFormatting,
  },
  {
    name: formatMessage(undoRedoMessages.undo),
    type: 'undo',
    keymap: () => undo,
  },
  {
    name: formatMessage(undoRedoMessages.redo),
    type: 'redo',
    keymap: () => redo,
  },
  {
    name: formatMessage(messages.pastePlainText),
    type: 'paste',
    keymap: () => pastePlainText,
  },
  {
    name: formatMessage(annotationMessages.createComment),
    type: 'annotation',
    keymap: () => addInlineComment,
  },
  {
    name: formatMessage(messages.CheckUncheckActionItem),
    type: 'checkbox',
    keymap: () => toggleTaskItemCheckbox,
  },
];

const imageAutoFormat: Format = {
  name: 'Image',
  type: 'image',
  autoFormatting: () => (
    <span>
      <span css={codeLg}>
        ![
        <FormattedMessage {...messages.altText} />
        ](http://www.image.com)
      </span>
    </span>
  ),
};

const quickInsertAutoFormat: (intl: IntlShape) => Format = ({
  formatMessage,
}) => ({
  name: formatMessage(messages.quickInsert),
  type: 'quickInsert',
  autoFormatting: () => (
    <span>
      <span css={codeLg}>/</span>
    </span>
  ),
});

const getKeyParts = (keymap: Keymap) => {
  let shortcut: string = keymap[browser.mac ? 'mac' : 'windows'];
  if (browser.mac) {
    shortcut = shortcut.replace('Alt', 'Opt');
  }
  return shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
};

export const getSupportedFormatting = (
  schema: Schema,
  intl: IntlShape,
  imageEnabled?: boolean,
  quickInsertEnabled?: boolean,
): Format[] => {
  const supportedBySchema = formatting(intl).filter(
    (format) => schema.nodes[format.type] || schema.marks[format.type],
  );
  return [
    ...navigationKeymaps(intl),
    ...supportedBySchema,
    ...(imageEnabled ? [imageAutoFormat] : []),
    ...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
    ...otherFormatting(intl),
  ];
};

export const getComponentFromKeymap = (keymap: Keymap) => {
  const keyParts = getKeyParts(keymap);
  return (
    <span>
      {keyParts.map((part, index) => {
        if (part === '+') {
          return <span key={`${keyParts}-${index}`}>{' + '}</span>;
        } else if (part === 'Cmd') {
          return (
            <span css={codeSm} key={`${keyParts}-${index}`}>
              ⌘
            </span>
          );
        } else if (
          ['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0
        ) {
          return (
            <span css={codeMd} key={`${keyParts}-${index}`}>
              {part}
            </span>
          );
        } else if (['f9', 'f10'].indexOf(part.toLowerCase()) >= 0) {
          return (
            <span css={codeLg} key={`${keyParts}-${index}`}>
              {part}
            </span>
          );
        } else if (part.toLowerCase() === 'enter') {
          return (
            <span css={codeSm} key={`${keyParts}-${index}`}>
              {'⏎'}
            </span>
          );
        }
        return (
          <span css={codeSm} key={`${keyParts}-${index}`}>
            {part.toUpperCase()}
          </span>
        );
      })}
    </span>
  );
};

const ModalHeader = injectIntl(
  ({ intl: { formatMessage } }: WrappedComponentProps) => {
    const { onClose } = useModal();
    return (
      <div css={header}>
        <h1 css={dialogHeader}>
          <FormattedMessage {...messages.editorHelp} />
        </h1>

        <div>
          <ToolbarButton
            // @ts-ignore
            onClick={onClose}
            title={formatMessage(messages.closeHelpDialog)}
            spacing="compact"
            iconBefore={
              <CrossIcon
                label={formatMessage(messages.closeHelpDialog)}
                size="medium"
              />
            }
          />
        </div>
      </div>
    );
  },
);

const ModalFooter = () => (
  <div css={footer}>
    <FormattedMessage
      {...messages.helpDialogTips}
      values={{ keyMap: getComponentFromKeymap(openHelp) }}
    />
  </div>
);

export interface HelpDialogProps {
  pluginInjectionApi: ExtractInjectionAPI<typeof helpDialogPlugin> | undefined;
  editorView: EditorView;
  quickInsertEnabled?: boolean;
}

const HelpDialog = ({
  pluginInjectionApi,
  editorView,
  quickInsertEnabled,
  intl,
}: HelpDialogProps & WrappedComponentProps) => {
  const { helpDialogState } = useSharedPluginState(pluginInjectionApi, [
    'helpDialog',
  ]);

  const closeDialog = useCallback(() => {
    const {
      state: { tr },
      dispatch,
    } = editorView;
    closeHelpCommand(tr, dispatch);
  }, [editorView]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && helpDialogState?.isVisible) {
        closeDialog();
      }
    },
    [closeDialog, helpDialogState?.isVisible],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [handleEsc]);

  const formatting: Format[] = getSupportedFormatting(
    editorView.state.schema,
    intl,
    helpDialogState?.imageEnabled,
    quickInsertEnabled,
  );

  return (
    <ModalTransition>
      {helpDialogState?.isVisible ? (
        <AkModalDialog
          width="large"
          onClose={closeDialog}
          testId="help-modal-dialog"
        >
          <ModalHeader />

          <div css={contentWrapper}>
            <div css={line} />
            <div css={content}>
              <div css={column}>
                <h2 css={title}>
                  <FormattedMessage {...messages.keyboardShortcuts} />
                </h2>
                <ul>
                  {formatting
                    .filter((form) => {
                      const keymap = form.keymap && form.keymap();
                      return keymap && keymap[browser.mac ? 'mac' : 'windows'];
                    })
                    .map((form) => (
                      <li css={row} key={`textFormatting-${form.name}`}>
                        <span>{form.name}</span>
                        {getComponentFromKeymap(form.keymap!())}
                      </li>
                    ))}

                  {formatting
                    .filter(
                      (form) =>
                        shortcutNamesWithoutKeymap.indexOf(form.type) !== -1,
                    )
                    .filter((form) => form.autoFormatting)
                    .map((form) => (
                      <li css={row} key={`autoFormatting-${form.name}`}>
                        <span>{form.name}</span>
                        {form.autoFormatting!()}
                      </li>
                    ))}
                </ul>
              </div>
              <div css={line} />
              <div css={column}>
                <h2 css={title}>
                  <FormattedMessage {...messages.markdown} />
                </h2>
                <ul>
                  {formatting
                    .filter(
                      (form) =>
                        shortcutNamesWithoutKeymap.indexOf(form.type) === -1,
                    )
                    .map(
                      (form) =>
                        form.autoFormatting && (
                          <li key={`autoFormatting-${form.name}`} css={row}>
                            <span>{form.name}</span>
                            {form.autoFormatting()}
                          </li>
                        ),
                    )}
                </ul>
              </div>
            </div>
          </div>

          <ModalFooter />
        </AkModalDialog>
      ) : null}
    </ModalTransition>
  );
};

export default injectIntl(HelpDialog);
