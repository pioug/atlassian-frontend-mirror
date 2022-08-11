/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import IndentIcon from '@atlaskit/icon/glyph/editor/indent';
import OutdentIcon from '@atlaskit/icon/glyph/editor/outdent';
import {
  toggleBulletList as toggleBulletListKeymap,
  toggleOrderedList as toggleOrderedListKeymap,
  indent as toggleIndentKeymap,
  outdent as toggleOutdentKeymap,
  ToolTipContent,
} from '../../../keymaps';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import { messages } from '../../list/messages';
import { messages as indentationMessages } from '../../indentation/messages';
import { ButtonName, ToolbarProps } from '../types';
import { buttonGroupStyle, separatorStyles } from '../../../ui/styles';

export function Toolbar(props: ToolbarProps) {
  const { formatMessage } = useIntl();
  const {
    disabled,
    isReducedSpacing,
    bulletListActive,
    bulletListDisabled,
    orderedListActive,
    orderedListDisabled,
    showIndentationButtons,
    indentDisabled,
    outdentDisabled,
    onItemActivated,
  } = props;
  const labelUnorderedList = formatMessage(messages.unorderedList);
  const labelOrderedList = formatMessage(messages.orderedList);

  const handleOnItemActivated = (buttonName: ButtonName) => (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => onItemActivated({ editorView: props.editorView, buttonName });

  return (
    <span css={buttonGroupStyle}>
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.BULLET_LIST}
        spacing={isReducedSpacing ? 'none' : 'default'}
        onClick={handleOnItemActivated('bullet_list')}
        selected={bulletListActive}
        aria-pressed={bulletListActive}
        aria-label={labelUnorderedList}
        disabled={bulletListDisabled || disabled}
        title={
          <ToolTipContent
            description={labelUnorderedList}
            keymap={toggleBulletListKeymap}
          />
        }
        iconBefore={<BulletListIcon label="" />}
      />
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.ORDERED_LIST}
        spacing={isReducedSpacing ? 'none' : 'default'}
        onClick={handleOnItemActivated('ordered_list')}
        selected={orderedListActive}
        aria-pressed={orderedListActive}
        aria-label={labelOrderedList}
        disabled={orderedListDisabled || disabled}
        title={
          <ToolTipContent
            description={labelOrderedList}
            keymap={toggleOrderedListKeymap}
          />
        }
        iconBefore={<NumberListIcon label="" />}
      />
      {showIndentationButtons && (
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.OUTDENT}
          testId={TOOLBAR_BUTTON.OUTDENT}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleOnItemActivated('outdent')}
          iconBefore={<OutdentIcon label="" />}
          disabled={outdentDisabled || disabled}
          aria-label={formatMessage(indentationMessages.outdent)}
          title={
            <ToolTipContent
              description={formatMessage(indentationMessages.outdent)}
              keymap={toggleOutdentKeymap}
            />
          }
        />
      )}
      {showIndentationButtons && (
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.INDENT}
          testId={TOOLBAR_BUTTON.INDENT}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleOnItemActivated('indent')}
          iconBefore={<IndentIcon label="" />}
          disabled={indentDisabled || disabled}
          aria-label={formatMessage(indentationMessages.indent)}
          title={
            <ToolTipContent
              description={formatMessage(indentationMessages.indent)}
              keymap={toggleIndentKeymap}
            />
          }
        />
      )}
      <span css={separatorStyles} />
    </span>
  );
}
