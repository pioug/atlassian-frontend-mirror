/** @jsx jsx */
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
}

// Extend the ButtonItem component type to allow mouse events to be accepted from the Typescript check
export interface DropdownButtonItemProps extends ButtonItemProps {
  onMouseEnter?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onMouseOver?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  onMouseLeave?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
const DropdownButtonItem: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    DropdownButtonItemProps & React.RefAttributes<HTMLElement>
  >
> = ButtonItem as any;

class Dropdown extends Component<Props & WrappedComponentProps> {
  render() {
    const { hide, dispatchCommand, items, intl } = this.props;
    return (
      <div css={menuContainer}>
        {items
          .filter((item) => !item.hidden)
          .map((item, idx) => {
            const itemContent = (
              <DropdownButtonItem
                key={idx}
                iconBefore={this.renderSelected(item, intl)}
                iconAfter={item.elemAfter}
                onClick={() => {
                  /**
                   * The order of dispatching the event and hide() is important, because
                   * the ClickAreaBlock will be relying on the element to calculate the
                   * click coordinate.
                   * For more details, please visit the comment in this PR https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5328/edm-1321-set-selection-near-smart-link?link_source=email#chg-packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx
                   */
                  dispatchCommand(item.onClick);
                  hide();
                }}
                data-testid={item.testId}
                isDisabled={item.disabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onMouseOver={(e) => {
                  if (item.onMouseOver) {
                    e.preventDefault();
                    dispatchCommand(item.onMouseOver);
                  }
                }}
                onMouseEnter={(e) => {
                  if (item.onMouseEnter) {
                    e.preventDefault();
                    dispatchCommand(item.onMouseEnter);
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.onMouseLeave) {
                    e.preventDefault();
                    dispatchCommand(item.onMouseLeave);
                  }
                }}
              >
                {item.title}
              </DropdownButtonItem>
            );

            if (item.tooltip) {
              return (
                <Tooltip key={idx} content={item.tooltip}>
                  {itemContent}
                </Tooltip>
              );
            }

            return itemContent;
          })}
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
