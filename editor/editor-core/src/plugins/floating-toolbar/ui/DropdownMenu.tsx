/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { B400 } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Item, { itemThemeNamespace } from '@atlaskit/item';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { DropdownOptionT } from './types';
import { injectIntl, WrappedComponentProps, IntlShape } from 'react-intl-next';
import messages from './messages';

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

  // temporary solution before we migrated off dst/item
  & span[class^='ItemParts__Before'] {
    margin-right: 4px;
  }
`;

const padding = gridSize();
export const itemSpacing = gridSize() / 2;

const editorItemTheme = {
  borderRadius: 0,
  beforeItemSpacing: {
    compact: itemSpacing,
  },
  padding: {
    compact: {
      bottom: padding,
      left: padding,
      right: padding,
      top: padding,
    },
  },
  height: {
    compact: menuItemDimensions.height,
  },
};

export interface Props {
  hide: Function;
  dispatchCommand: Function;
  items: Array<DropdownOptionT<Function>>;
}

class Dropdown extends Component<Props & WrappedComponentProps> {
  render() {
    const { hide, dispatchCommand, items, intl } = this.props;
    return (
      <div css={menuContainer}>
        {items
          .filter((item) => !item.hidden)
          .map((item, idx) => {
            const itemContent = (
              <Item
                key={idx}
                isCompact={true}
                elemBefore={this.renderSelected(item, intl)}
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
                theme={{ [itemThemeNamespace]: editorItemTheme }}
              >
                {item.title}
              </Item>
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
    const { selected } = item;
    if (selected !== undefined) {
      return selected ? (
        <EditorDoneIcon
          primaryColor={B400}
          size="small"
          label={intl.formatMessage(messages.confirmModalOK)}
        />
      ) : (
        <span css={spacer} />
      );
    }

    return;
  }
}

export default injectIntl(Dropdown);
