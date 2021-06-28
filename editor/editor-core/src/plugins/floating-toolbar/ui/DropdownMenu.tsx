import React from 'react';
import { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { B400 } from '@atlaskit/theme/colors';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { DropdownOptionT } from './types';

export const menuItemDimensions = {
  width: 175,
  height: 32,
};

const Spacer = styled.span`
  display: flex;
  flex: 1;
  padding: 8px;
`;

const MenuContainer = styled.div`
  min-width: ${menuItemDimensions.width}px;
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

export default class Dropdown extends Component<Props> {
  render() {
    const { hide, dispatchCommand, items } = this.props;
    return (
      <ThemeProvider theme={{ [itemThemeNamespace]: editorItemTheme }}>
        <MenuContainer>
          {items
            .filter((item) => !item.hidden)
            .map((item, idx) => {
              const itemContent = (
                <Item
                  key={idx}
                  isCompact={true}
                  elemBefore={this.renderSelected(item)}
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
        </MenuContainer>
      </ThemeProvider>
    );
  }

  private renderSelected(item: DropdownOptionT<any>) {
    const { selected } = item;
    if (selected !== undefined) {
      return selected ? (
        <EditorDoneIcon
          primaryColor={B400}
          size="small"
          label="test question"
        />
      ) : (
        <Spacer />
      );
    }

    return;
  }
}
