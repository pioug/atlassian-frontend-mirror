/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import {
  injectIntl,
  defineMessages,
  FormattedMessage,
  IntlShape,
  WrappedComponentProps,
} from 'react-intl-next';
import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
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
import * as keymaps from '../../../keymaps';
import ToolbarButton from '../../../ui/ToolbarButton';
import { toolbarMessages } from '../../text-formatting/ui/Toolbar/toolbar-messages';
import { messages as listMessages } from '../../list/messages';
import { messages as insertBlockMessages } from '../../insert-block/ui/ToolbarInsertBlock/messages';
import { messages as blockTypeMessages } from '../../block-type/messages';
import { messages as undoRedoMessages } from '../../undo-redo/messages';
import { alignmentMessages } from '../../../ui/Alignment/messages';
import { closeHelpCommand } from '../commands';
import { annotationMessages } from '../../annotation/toolbar';

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

export const formatting: (intl: IntlShape) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(toolbarMessages.bold),
    type: 'strong',
    keymap: () => keymaps.toggleBold,
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
    keymap: () => keymaps.toggleItalic,
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
    keymap: () => keymaps.toggleUnderline,
  },
  {
    name: formatMessage(toolbarMessages.strike),
    type: 'strike',
    keymap: () => keymaps.toggleStrikethrough,
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
    keymap: () => keymaps.toggleSubscript,
  },
  {
    name: formatMessage(toolbarMessages.superscript),
    type: 'subsup',
    keymap: () => keymaps.toggleSuperscript,
  },
  {
    name: formatMessage(blockTypeMessages.heading1),
    type: 'heading',
    keymap: () => keymaps.toggleHeading1,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>#</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading2),
    type: 'heading',
    keymap: () => keymaps.toggleHeading2,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>##</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading3),
    type: 'heading',
    keymap: () => keymaps.toggleHeading3,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>###</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading4),
    type: 'heading',
    keymap: () => keymaps.toggleHeading4,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>####</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading5),
    type: 'heading',
    keymap: () => keymaps.toggleHeading5,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>#####</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading6),
    type: 'heading',
    keymap: () => keymaps.toggleHeading6,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>######</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.normal),
    type: 'paragraph',
    keymap: () => keymaps.setNormalText,
  },
  {
    name: formatMessage(listMessages.orderedList),
    type: 'orderedList',
    keymap: () => keymaps.toggleOrderedList,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>1.</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(listMessages.unorderedList),
    type: 'bulletList',
    keymap: () => keymaps.toggleBulletList,
    autoFormatting: () => (
      <span>
        <span css={codeSm}>*</span> <span css={codeLg}>Space</span>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.blockquote),
    type: 'blockquote',
    keymap: () => keymaps.toggleBlockQuote,
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
    keymap: () => keymaps.insertRule,
    autoFormatting: () => (
      <span>
        <span css={codeLg}>---</span>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.link),
    type: 'link',
    keymap: () => keymaps.addLink,
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
    keymap: () => keymaps.toggleCode,
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
    keymap: () => keymaps.alignLeft,
  },
  {
    name: formatMessage(alignmentMessages.alignRight),
    type: 'alignment',
    keymap: () => keymaps.alignRight,
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
    keymap: () => keymaps.clearFormatting,
  },
  {
    name: formatMessage(undoRedoMessages.undo),
    type: 'undo',
    keymap: () => keymaps.undo,
  },
  {
    name: formatMessage(undoRedoMessages.redo),
    type: 'redo',
    keymap: () => keymaps.redo,
  },
  {
    name: formatMessage(messages.pastePlainText),
    type: 'paste',
    keymap: () => keymaps.pastePlainText,
  },
  {
    name: formatMessage(annotationMessages.createComment),
    type: 'annotation',
    keymap: () => keymaps.addInlineComment,
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

const getKeyParts = (keymap: keymaps.Keymap) => {
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
    ...supportedBySchema,
    ...(imageEnabled ? [imageAutoFormat] : []),
    ...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
    ...otherFormatting(intl),
  ];
};

export const getComponentFromKeymap = (keymap: keymaps.Keymap) => {
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

export interface Props {
  editorView: EditorView;
  isVisible: boolean;
  imageEnabled?: boolean;
  quickInsertEnabled?: boolean;
}

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
      values={{ keyMap: getComponentFromKeymap(keymaps.openHelp) }}
    />
  </div>
);

class HelpDialog extends React.Component<Props & WrappedComponentProps> {
  static displayName = 'HelpDialog';

  private formatting: Format[] = [];

  closeDialog = () => {
    const {
      state: { tr },
      dispatch,
    } = this.props.editorView;
    closeHelpCommand(tr, dispatch);
  };

  handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.props.isVisible) {
      this.closeDialog();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  render() {
    const { editorView, intl, imageEnabled, quickInsertEnabled } = this.props;
    this.formatting = getSupportedFormatting(
      editorView.state.schema,
      intl,
      imageEnabled,
      quickInsertEnabled,
    );

    return (
      <ModalTransition>
        {this.props.isVisible ? (
          <AkModalDialog
            width="large"
            onClose={this.closeDialog}
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
                    {this.formatting
                      .filter((form) => {
                        const keymap = form.keymap && form.keymap(this.props);
                        return (
                          keymap && keymap[browser.mac ? 'mac' : 'windows']
                        );
                      })
                      .map((form) => (
                        <li css={row} key={`textFormatting-${form.name}`}>
                          <span>{form.name}</span>
                          {getComponentFromKeymap(form.keymap!())}
                        </li>
                      ))}

                    {this.formatting
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
                    {this.formatting
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
  }
}

export default injectIntl(HelpDialog);
