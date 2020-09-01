import React from 'react';
import {
  injectIntl,
  defineMessages,
  FormattedMessage,
  InjectedIntl,
  InjectedIntlProps,
} from 'react-intl';
import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { browser } from '@atlaskit/editor-common';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import {
  Header,
  Footer,
  ContentWrapper,
  Line,
  Content,
  ColumnRight,
  ColumnLeft,
  Row,
  CodeSm,
  CodeMd,
  CodeLg,
  Title,
} from './styles';
import * as keymaps from '../../../keymaps';
import ToolbarButton from '../../../ui/ToolbarButton';
import { toolbarMessages as textFormattingMessages } from '../../text-formatting/ui/ToolbarTextFormatting/toolbar-messages';
import { toolbarMessages as advancedTextFormattingMessages } from '../../text-formatting/ui/ToolbarAdvancedTextFormatting/toolbar-messages';
import { messages as listMessages } from '../../lists/messages';
import { messages as insertBlockMessages } from '../../insert-block/ui/ToolbarInsertBlock/messages';
import { messages as blockTypeMessages } from '../../block-type/messages';
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
  undo: {
    id: 'fabric.editor.undo',
    defaultMessage: 'Undo',
    description: '',
  },
  redo: {
    id: 'fabric.editor.redo',
    defaultMessage: 'Redo',
    description: '',
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

const AkModalDialog: React.ComponentClass<any> = Modal;

export interface Format {
  name: string;
  type: string;
  keymap?: Function;
  autoFormatting?: Function;
  imageEnabled?: boolean;
}

export const formatting: (intl: InjectedIntl) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(textFormattingMessages.bold),
    type: 'strong',
    keymap: () => keymaps.toggleBold,
    autoFormatting: () => (
      <span>
        <CodeLg>
          **
          <FormattedMessage {...textFormattingMessages.bold} />
          **
        </CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(textFormattingMessages.italic),
    type: 'em',
    keymap: () => keymaps.toggleItalic,
    autoFormatting: () => (
      <span>
        <CodeLg>
          *<FormattedMessage {...textFormattingMessages.italic} />*
        </CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(advancedTextFormattingMessages.underline),
    type: 'underline',
    keymap: () => keymaps.toggleUnderline,
  },
  {
    name: formatMessage(advancedTextFormattingMessages.strike),
    type: 'strike',
    keymap: () => keymaps.toggleStrikethrough,
    autoFormatting: () => (
      <span>
        <CodeLg>
          ~~
          <FormattedMessage {...advancedTextFormattingMessages.strike} />
          ~~
        </CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading1),
    type: 'heading',
    keymap: () => keymaps.toggleHeading1,
    autoFormatting: () => (
      <span>
        <CodeSm>#</CodeSm> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading2),
    type: 'heading',
    keymap: () => keymaps.toggleHeading2,
    autoFormatting: () => (
      <span>
        <CodeLg>##</CodeLg> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading3),
    type: 'heading',
    keymap: () => keymaps.toggleHeading3,
    autoFormatting: () => (
      <span>
        <CodeLg>###</CodeLg> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading4),
    type: 'heading',
    keymap: () => keymaps.toggleHeading4,
    autoFormatting: () => (
      <span>
        <CodeLg>####</CodeLg> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading5),
    type: 'heading',
    keymap: () => keymaps.toggleHeading5,
    autoFormatting: () => (
      <span>
        <CodeLg>#####</CodeLg> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.heading6),
    type: 'heading',
    keymap: () => keymaps.toggleHeading6,
    autoFormatting: () => (
      <span>
        <CodeLg>######</CodeLg> <CodeLg>Space</CodeLg>
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
        <CodeSm>1.</CodeSm> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(listMessages.unorderedList),
    type: 'bulletList',
    keymap: () => keymaps.toggleBulletList,
    autoFormatting: () => (
      <span>
        <CodeSm>*</CodeSm> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.blockquote),
    type: 'blockquote',
    keymap: () => keymaps.toggleBlockQuote,
    autoFormatting: () => (
      <span>
        <CodeLg>{'>'}</CodeLg> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(blockTypeMessages.codeblock),
    type: 'codeBlock',
    autoFormatting: () => (
      <span>
        <CodeLg>```</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.horizontalRule),
    type: 'rule',
    keymap: () => keymaps.insertRule,
    autoFormatting: () => (
      <span>
        <CodeLg>---</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.link),
    type: 'link',
    keymap: () => keymaps.addLink,
    autoFormatting: () => (
      <span>
        <CodeLg>
          [<FormattedMessage {...insertBlockMessages.link} />
          ](http://a.com)
        </CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(advancedTextFormattingMessages.code),
    type: 'code',
    keymap: () => keymaps.toggleCode,
    autoFormatting: () => (
      <span>
        <CodeLg>
          `<FormattedMessage {...advancedTextFormattingMessages.code} />`
        </CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.action),
    type: 'taskItem',
    autoFormatting: () => (
      <span>
        <CodeSm>[]</CodeSm> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.decision),
    type: 'decisionItem',
    autoFormatting: () => (
      <span>
        <CodeSm>&lt;&gt;</CodeSm> <CodeLg>Space</CodeLg>
      </span>
    ),
  },
  {
    name: formatMessage(insertBlockMessages.emoji),
    type: 'emoji',
    autoFormatting: () => (
      <span>
        <CodeLg>:</CodeLg>
      </span>
    ),
  },

  {
    name: formatMessage(insertBlockMessages.mention),
    type: 'mention',
    autoFormatting: () => (
      <span>
        <CodeLg>@</CodeLg>
      </span>
    ),
  },
];
const shortcutNamesWithoutKeymap: string[] = [
  'emoji',
  'mention',
  'quickInsert',
];

const otherFormatting: (intl: InjectedIntl) => Format[] = ({
  formatMessage,
}) => [
  {
    name: formatMessage(advancedTextFormattingMessages.clearFormatting),
    type: 'clearFormatting',
    keymap: () => keymaps.clearFormatting,
  },
  {
    name: formatMessage(messages.undo),
    type: 'undo',
    keymap: () => keymaps.undo,
  },
  {
    name: formatMessage(messages.redo),
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
      <CodeLg>
        ![
        <FormattedMessage {...messages.altText} />
        ](http://www.image.com)
      </CodeLg>
    </span>
  ),
};

const quickInsertAutoFormat: (intl: InjectedIntl) => Format = ({
  formatMessage,
}) => ({
  name: formatMessage(messages.quickInsert),
  type: 'quickInsert',
  autoFormatting: () => (
    <span>
      <CodeLg>/</CodeLg>
    </span>
  ),
});

export const getSupportedFormatting = (
  schema: Schema,
  intl: InjectedIntl,
  imageEnabled?: boolean,
  quickInsertEnabled?: boolean,
): Format[] => {
  const supportedBySchema = formatting(intl).filter(
    format => schema.nodes[format.type] || schema.marks[format.type],
  );
  return [
    ...supportedBySchema,
    ...(imageEnabled ? [imageAutoFormat] : []),
    ...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
    ...otherFormatting(intl),
  ];
};

export const getComponentFromKeymap = (keymap: keymaps.Keymap) => {
  let shortcut: string = keymap[browser.mac ? 'mac' : 'windows'];
  if (browser.mac) {
    shortcut = shortcut.replace('Alt', 'Opt');
  }
  const keyParts = shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
  return (
    <span>
      {keyParts.map((part, index) => {
        if (part === '+') {
          return <span key={`${shortcut}-${index}`}>{' + '}</span>;
        } else if (part === 'Cmd') {
          return <CodeSm key={`${shortcut}-${index}`}>⌘</CodeSm>;
        } else if (
          ['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0
        ) {
          return <CodeMd key={`${shortcut}-${index}`}>{part}</CodeMd>;
        }
        return (
          <CodeSm key={`${shortcut}-${index}`}>{part.toUpperCase()}</CodeSm>
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
  ({
    onClose,
    showKeyline,
    intl: { formatMessage },
  }: { onClose: () => void; showKeyline: boolean } & InjectedIntlProps) => (
    <Header showKeyline={showKeyline}>
      <FormattedMessage {...messages.editorHelp} />
      <div>
        <ToolbarButton
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
    </Header>
  ),
);

const ModalFooter = ({ showKeyline }: { showKeyline: boolean }) => (
  <Footer showKeyline={showKeyline}>
    <FormattedMessage
      {...messages.helpDialogTips}
      values={{ keyMap: getComponentFromKeymap(keymaps.openHelp) }}
    />
  </Footer>
);

class HelpDialog extends React.Component<Props & InjectedIntlProps> {
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
            components={{ Header: ModalHeader, Footer: ModalFooter }}
          >
            <ContentWrapper>
              <Line />
              <Content>
                <ColumnLeft>
                  <Title>
                    <FormattedMessage {...messages.keyboardShortcuts} />
                  </Title>
                  <div>
                    {this.formatting
                      .filter(form => {
                        const keymap = form.keymap && form.keymap(this.props);
                        return (
                          keymap && keymap[browser.mac ? 'mac' : 'windows']
                        );
                      })
                      .map(form => (
                        <Row key={`textFormatting-${form.name}`}>
                          <span>{form.name}</span>
                          {getComponentFromKeymap(form.keymap!())}
                        </Row>
                      ))}

                    {this.formatting
                      .filter(
                        form =>
                          shortcutNamesWithoutKeymap.indexOf(form.type) !== -1,
                      )
                      .filter(form => form.autoFormatting)
                      .map(form => (
                        <Row key={`autoFormatting-${form.name}`}>
                          <span>{form.name}</span>
                          {form.autoFormatting!()}
                        </Row>
                      ))}
                  </div>
                </ColumnLeft>
                <Line />
                <ColumnRight>
                  <Title>
                    <FormattedMessage {...messages.markdown} />
                  </Title>
                  <div>
                    {this.formatting
                      .filter(
                        form =>
                          shortcutNamesWithoutKeymap.indexOf(form.type) === -1,
                      )
                      .map(
                        form =>
                          form.autoFormatting && (
                            <Row key={`autoFormatting-${form.name}`}>
                              <span>{form.name}</span>
                              {form.autoFormatting()}
                            </Row>
                          ),
                      )}
                  </div>
                </ColumnRight>
              </Content>
            </ContentWrapper>
          </AkModalDialog>
        ) : null}
      </ModalTransition>
    );
  }
}

export default injectIntl(HelpDialog);
