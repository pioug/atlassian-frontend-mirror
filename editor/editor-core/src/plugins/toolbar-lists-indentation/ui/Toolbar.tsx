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
  tooltip,
} from '../../../keymaps';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import {
  listMessages as messages,
  indentationMessages,
} from '@atlaskit/editor-common/messages';
import type { ButtonName, ToolbarProps } from '../types';
import {
  separatorStyles,
  buttonGroupStyle,
} from '@atlaskit/editor-common/styles';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import { useEffect, useRef } from 'react';

export function Toolbar(props: ToolbarProps) {
  const { formatMessage } = useIntl();

  const indentButtonRef = useRef<HTMLElement | null>(null);
  const outdentButtonRef = useRef<HTMLElement | null>(null);

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
  const indentMessage = formatMessage(indentationMessages.indent);
  const outdentMessage = formatMessage(indentationMessages.outdent);
  const isIndentButtonFocused =
    document.activeElement === indentButtonRef.current;
  const isOutdentButtonFocused =
    document.activeElement === outdentButtonRef.current;

  const handleOnItemActivated =
    (buttonName: ButtonName) =>
    (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
      onItemActivated({
        editorView: props.editorView,
        buttonName,
      });

  useEffect(() => {
    if (isIndentButtonFocused && indentDisabled && outdentButtonRef.current) {
      outdentButtonRef.current.focus();
    }
  }, [indentButtonRef, indentDisabled, isIndentButtonFocused]);

  useEffect(() => {
    if (isOutdentButtonFocused && outdentDisabled && indentButtonRef.current) {
      indentButtonRef.current.focus();
    }
  }, [outdentButtonRef, outdentDisabled, isOutdentButtonFocused]);

  return (
    <span css={buttonGroupStyle}>
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.BULLET_LIST}
        testId={labelUnorderedList}
        spacing={isReducedSpacing ? 'none' : 'default'}
        onClick={handleOnItemActivated('bullet_list')}
        selected={bulletListActive}
        aria-pressed={bulletListActive}
        aria-label={tooltip(toggleBulletListKeymap, labelUnorderedList)}
        aria-keyshortcuts={getAriaKeyshortcuts(toggleBulletListKeymap)}
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
        testId={labelOrderedList}
        spacing={isReducedSpacing ? 'none' : 'default'}
        onClick={handleOnItemActivated('ordered_list')}
        selected={orderedListActive}
        aria-pressed={orderedListActive}
        aria-label={tooltip(toggleOrderedListKeymap, labelOrderedList)}
        aria-keyshortcuts={getAriaKeyshortcuts(toggleOrderedListKeymap)}
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
          ref={outdentButtonRef}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleOnItemActivated('outdent')}
          iconBefore={<OutdentIcon label="" />}
          disabled={outdentDisabled || disabled}
          aria-label={tooltip(toggleOutdentKeymap, outdentMessage)}
          aria-keyshortcuts={getAriaKeyshortcuts(toggleOutdentKeymap)}
          title={
            <ToolTipContent
              description={outdentMessage}
              keymap={toggleOutdentKeymap}
            />
          }
        />
      )}
      {showIndentationButtons && (
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.INDENT}
          testId={TOOLBAR_BUTTON.INDENT}
          ref={indentButtonRef}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleOnItemActivated('indent')}
          iconBefore={<IndentIcon label="" />}
          disabled={indentDisabled || disabled}
          aria-label={tooltip(toggleIndentKeymap, indentMessage)}
          aria-keyshortcuts={getAriaKeyshortcuts(toggleIndentKeymap)}
          title={
            <ToolTipContent
              description={indentMessage}
              keymap={toggleIndentKeymap}
            />
          }
        />
      )}
      <span css={separatorStyles} />
    </span>
  );
}
