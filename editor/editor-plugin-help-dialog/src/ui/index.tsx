/** @jsx jsx */
import { useCallback, useEffect } from 'react';

import { jsx } from '@emotion/react';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
  addInlineComment,
  addLink,
  alignCenter,
  alignLeft,
  alignRight,
  clearFormatting,
  decreaseMediaSize,
  focusTableResizer,
  increaseMediaSize,
  insertRule,
  navToEditorToolbar,
  navToFloatingToolbar,
  openHelp,
  pastePlainText,
  redo,
  setNormalText,
  toggleBlockQuote,
  toggleBold,
  toggleBulletList,
  toggleCode,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleHeading4,
  toggleHeading5,
  toggleHeading6,
  toggleItalic,
  toggleOrderedList,
  toggleStrikethrough,
  toggleSubscript,
  toggleSuperscript,
  toggleTaskItemCheckbox,
  toggleUnderline,
  undo,
} from '@atlaskit/editor-common/keymaps';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import {
  alignmentMessages,
  annotationMessages,
  blockTypeMessages,
  listMessages,
  helpDialogMessages as messages,
  toolbarInsertBlockMessages,
  toolbarMessages,
  undoRedoMessages,
} from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { browser } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AkModalDialog, {
  ModalTransition,
  useModal,
} from '@atlaskit/modal-dialog';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { closeHelpCommand } from '../commands';
import type { HelpDialogPlugin } from '../types';

import {
  codeLg,
  codeMd,
  codeSm,
  column,
  componentFromKeymapWrapperStyles,
  content,
  contentWrapper,
  dialogHeader,
  footer,
  header,
  line,
  row,
  shortcutsArray,
  title,
} from './styles';

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
    name: formatMessage(toolbarInsertBlockMessages.horizontalRule),
    type: 'rule',
    keymap: () => insertRule,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>---</span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarInsertBlockMessages.link),
    type: 'link',
    keymap: () => addLink,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>
          [<FormattedMessage {...toolbarInsertBlockMessages.link} />
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
    name: formatMessage(toolbarInsertBlockMessages.action),
    type: 'taskItem',
    autoFormatting: () => (
      <span>
        <span css={codeSm}>[]</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarInsertBlockMessages.decision),
    type: 'decisionItem',
    autoFormatting: () => (
      <span>
        <span css={codeSm}>&lt;&gt;</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarInsertBlockMessages.emoji),
    type: 'emoji',
    autoFormatting: () => (
      <span>
        <span css={codeLg}>:</span>
      </span>
    ),
  },
  {
    name: formatMessage(toolbarInsertBlockMessages.mention),
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
  ...(getBooleanFF('platform.editor.text-alignment-keyboard-shortcuts')
    ? [
        {
          name: formatMessage(alignmentMessages.alignCenter),
          type: 'alignment',
          keymap: () => alignCenter,
        },
        {
          name: formatMessage(alignmentMessages.alignRight),
          type: 'alignment',
          keymap: () => alignRight,
        },
      ]
    : []),
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
  {
    name: formatMessage(messages.selectTableRow),
    type: 'table',
    autoFormatting: () => (
      <span css={shortcutsArray}>
        <span>
          <span css={browser.mac ? codeSm : codeMd}>
            {browser.mac ? '⌘' : 'Ctrl'}
          </span>
          {' + '}
          <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
          {' + '}
          <span css={codeMd}>Shift</span>
          {' + '}
          <span css={codeSm}>←</span>
        </span>
        <span>
          <span css={browser.mac ? codeSm : codeMd}>
            {browser.mac ? '⌘' : 'Ctrl'}
          </span>
          {' + '}
          <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
          {' + '}
          <span css={codeMd}>Shift</span>
          {' + '}
          <span css={codeSm}>→</span>
        </span>
      </span>
    ),
  },
  {
    name: formatMessage(messages.selectTableColumn),
    type: 'table',
    autoFormatting: () => (
      <span css={shortcutsArray}>
        <span>
          <span css={browser.mac ? codeSm : codeMd}>
            {browser.mac ? '⌘' : 'Ctrl'}
          </span>
          {' + '}
          <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
          {' + '}
          <span css={codeMd}>Shift</span>
          {' + '}
          <span css={codeSm}>↑</span>
        </span>
        <span>
          <span css={browser.mac ? codeSm : codeMd}>
            {browser.mac ? '⌘' : 'Ctrl'}
          </span>
          {' + '}
          <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
          {' + '}
          <span css={codeMd}>Shift</span>
          {' + '}
          <span css={codeSm}>↓</span>
        </span>
      </span>
    ),
  },
  ...(getBooleanFF('platform.editor.a11y-column-resizing_emcvz')
    ? [
        {
          name: formatMessage(messages.selectColumnResize),
          type: 'table',
          autoFormatting: () => (
            <span css={shortcutsArray}>
              <span>
                <span css={browser.mac ? codeSm : codeMd}>
                  {browser.mac ? '⌘' : 'Ctrl'}
                </span>
                {' + '}
                <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
                {' + '}
                <span css={codeMd}>Shift</span>
                {' + '}
                <span css={codeSm}>C</span>
              </span>
            </span>
          ),
        },
        {
          name: formatMessage(messages.increaseColumnSize),
          type: 'table',
          autoFormatting: () => (
            <span css={shortcutsArray}>
              <span>
                <span css={browser.mac ? codeSm : codeMd}>
                  {browser.mac ? '⌘' : 'Ctrl'}
                </span>
                {' + '}
                <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
                {' + '}
                <span css={codeMd}>[</span>
              </span>
            </span>
          ),
        },
        {
          name: formatMessage(messages.decreaseColumnSize),
          type: 'table',
          autoFormatting: () => (
            <span css={shortcutsArray}>
              <span>
                <span css={browser.mac ? codeSm : codeMd}>
                  {browser.mac ? '⌘' : 'Ctrl'}
                </span>
                {' + '}
                <span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
                {' + '}
                <span css={codeMd}>]</span>
              </span>
            </span>
          ),
        },
      ]
    : []),
];

const resizeInformationFormatting: (intl: IntlShape) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(messages.increaseSize),
    type: 'media',
    keymap: () => increaseMediaSize,
  },
  {
    name: formatMessage(messages.decreaseSize),
    type: 'media',
    keymap: () => decreaseMediaSize,
  },
];

const focusTableResizeHandleFormatting: (intl: IntlShape) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(messages.focusTableResizeHandle),
    type: 'navigation',
    keymap: () => focusTableResizer,
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

const isAnyA11yResizeFeatureFlagEnabled =
  getBooleanFF('platform.editor.a11y-media-resizing_b5v0o') ||
  getBooleanFF('platform.editor.a11y-table-resizing_uapcv');

export const getSupportedFormatting = (
  schema: Schema,
  intl: IntlShape,
  imageEnabled?: boolean,
  quickInsertEnabled?: boolean,
): Format[] => {
  const supportedBySchema = formatting(intl).filter(
    format => schema.nodes[format.type] || schema.marks[format.type],
  );
  return [
    ...navigationKeymaps(intl),
    ...supportedBySchema,
    ...(imageEnabled ? [imageAutoFormat] : []),
    ...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
    ...otherFormatting(intl),
    ...(isAnyA11yResizeFeatureFlagEnabled
      ? resizeInformationFormatting(intl)
      : []),
    ...(getBooleanFF('platform.editor.a11y-table-resizing_uapcv')
      ? focusTableResizeHandleFormatting(intl)
      : []),
  ];
};

export const getComponentFromKeymap = (keymap: Keymap) => {
  const keyParts = getKeyParts(keymap);
  return (
    <span css={componentFromKeymapWrapperStyles}>
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
  pluginInjectionApi: ExtractInjectionAPI<HelpDialogPlugin> | undefined;
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
                    .filter(form => {
                      const keymap = form.keymap && form.keymap();
                      return keymap && keymap[browser.mac ? 'mac' : 'windows'];
                    })
                    .map(form => (
                      <li css={row} key={`textFormatting-${form.name}`}>
                        <span>{form.name}</span>
                        {getComponentFromKeymap(form.keymap!())}
                      </li>
                    ))}

                  {formatting
                    .filter(
                      form =>
                        shortcutNamesWithoutKeymap.indexOf(form.type) !== -1,
                    )
                    .filter(form => form.autoFormatting)
                    .map(form => (
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
                      form =>
                        shortcutNamesWithoutKeymap.indexOf(form.type) === -1,
                    )
                    .map(
                      form =>
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
