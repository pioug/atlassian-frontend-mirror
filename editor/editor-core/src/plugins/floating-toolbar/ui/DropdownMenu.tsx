/** @jsx jsx */
import { useState, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { B400 } from '@atlaskit/theme/colors';
import { ButtonItem, ButtonItemProps } from '@atlaskit/menu';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { DropdownOptionT } from './types';
import { injectIntl, WrappedComponentProps, IntlShape } from 'react-intl-next';
import messages from './messages';
import { token } from '@atlaskit/tokens';
import { EditorView } from 'prosemirror-view';

export const menuItemDimensions = {
  width: 175,
  height: 32,
};

const spacer = css`
  display: flex;
  flex: 1;
  padding: 8px;
`;

const menuContainer = css`
  min-width: ${menuItemDimensions.width}px;

  // temporary solution to retain spacing defined by @atlaskit/Item
  & button {
    min-height: ${gridSize() * 4}px;
    padding: 8px 8px 7px;

    & > [data-item-elem-before] {
      margin-right: ${gridSize() / 2}px;
    }
  }
`;

export const itemSpacing = gridSize() / 2;
export interface Props {
  hide: Function;
  dispatchCommand: Function;
  items: Array<DropdownOptionT<Function>>;
  showSelected?: boolean;
  editorView?: EditorView;
}

// Extend the ButtonItem component type to allow mouse events to be accepted from the Typescript check
export interface DropdownButtonItemProps extends ButtonItemProps {
  onMouseEnter?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onMouseOver?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onMouseLeave?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onFocus?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onBlur?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
const DropdownButtonItem: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    DropdownButtonItemProps & React.RefAttributes<HTMLElement>
  >
> = ButtonItem as any;

const DropdownMenuItem = ({
  item,
  hide,
  dispatchCommand,
  editorView,
  iconBefore,
}: {
  item: DropdownOptionT<Function>;
  hide: Function;
  dispatchCommand: Function;
  editorView?: EditorView;
  iconBefore: React.ReactNode;
}) => {
  const [tooltipContent, setTooltipContent] = useState<string>(
    item.tooltip || '',
  );

  const handleTooltipMouseOut = useCallback(() => {
    setTooltipContent('');
  }, []);

  const handleItemMouseDown = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleItemMouseOver = useCallback(
    (e) => {
      setTooltipContent(item.tooltip || '');
      if (item.onMouseOver) {
        e.preventDefault();
        dispatchCommand(item.onMouseOver);
      }
    },
    [item.tooltip, item.onMouseOver, dispatchCommand],
  );

  const handleItemMouseEnter = useCallback(
    (e) => {
      if (item.onMouseEnter) {
        e.preventDefault();
        dispatchCommand(item.onMouseEnter);
      }
    },
    [item.onMouseEnter, dispatchCommand],
  );

  const handleItemMouseLeave = useCallback(
    (e) => {
      if (item.onMouseLeave) {
        e.preventDefault();
        dispatchCommand(item.onMouseLeave);
      }
    },
    [item.onMouseLeave, dispatchCommand],
  );

  const handleItemOnFocus = useCallback(
    (e) => {
      if (item.onFocus) {
        e.preventDefault();
        dispatchCommand(item.onFocus);
      }
    },
    [item.onFocus, dispatchCommand],
  );

  const handleItemOnBlur = useCallback(
    (e) => {
      if (item.onBlur) {
        e.preventDefault();
        dispatchCommand(item.onBlur);
      }
    },
    [item.onBlur, dispatchCommand],
  );

  const handleItemClick = useCallback(() => {
    /**
     * The order of dispatching the event and hide() is important, because
     * the ClickAreaBlock will be relying on the element to calculate the
     * click coordinate.
     * For more details, please visit the comment in this PR https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5328/edm-1321-set-selection-near-smart-link?link_source=email#chg-packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx
     */
    dispatchCommand(item.onClick);
    hide();
    if (!editorView?.hasFocus()) {
      editorView?.focus();
    }
  }, [dispatchCommand, item.onClick, hide, editorView]);

  const itemContent = (
    <DropdownButtonItem
      iconBefore={iconBefore}
      iconAfter={item.elemAfter}
      onClick={handleItemClick}
      data-testid={item.testId}
      isDisabled={item.disabled}
      onMouseDown={handleItemMouseDown}
      onMouseOver={handleItemMouseOver}
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
      onFocus={handleItemOnFocus}
      onBlur={handleItemOnBlur}
    >
      {item.title}
    </DropdownButtonItem>
  );

  if (tooltipContent) {
    return (
      <Tooltip content={tooltipContent}>
        <div onMouseOut={handleTooltipMouseOut}>{itemContent}</div>
      </Tooltip>
    );
  }

  return itemContent;
};

class Dropdown extends Component<Props & WrappedComponentProps> {
  render() {
    const { hide, dispatchCommand, items, intl, editorView } = this.props;
    return (
      <div css={menuContainer}>
        {items
          .filter((item) => !item.hidden)
          .map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              item={item}
              hide={hide}
              dispatchCommand={dispatchCommand}
              editorView={editorView}
              iconBefore={this.renderSelected(item, intl)}
            />
          ))}
      </div>
    );
  }

  private renderSelected(item: DropdownOptionT<any>, intl: IntlShape) {
    const { showSelected = true } = this.props;
    const { selected } = item;

    if (showSelected && selected) {
      return (
        <EditorDoneIcon
          primaryColor={token('color.icon.selected', B400)}
          size="small"
          label={intl.formatMessage(messages.confirmModalOK)}
        />
      );
    }

    return <span css={spacer} />;
  }
}

export default injectIntl(Dropdown);
