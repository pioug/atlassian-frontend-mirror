import React from 'react';
import { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import LinkSearchListItem from './LinkSearchListItem';
import { LinkSearchListItemData } from './types';

const ListContainer = styled.div`
  padding-top: 0;
`;

const SpinnerContainer = styled.div`
  text-align: center;
  min-height: 80px;
  margin-top: 30px;
`;

export const List = styled.ul`
  padding: 0;
  list-style: none;
`;

export interface Props {
  items?: LinkSearchListItemData[];
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (href: string, text: string) => void;
  onMouseMove?: (objectId: string) => void;
  onMouseEnter?: (objectId: string) => void;
  onMouseLeave?: (objectId: string) => void;
  ariaControls?: string;
}

export default class LinkSearchList extends PureComponent<Props, {}> {
  render() {
    const {
      onSelect,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      items,
      selectedIndex,
      isLoading,
      ariaControls,
    } = this.props;

    let itemsContent;
    let loadingContent;

    if (items && items.length > 0) {
      itemsContent = (
        <List aria-controls={ariaControls}>
          {items.map((item, index) => (
            <LinkSearchListItem
              item={item}
              selected={selectedIndex === index}
              onMouseMove={onMouseMove}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onSelect={onSelect}
              key={item.objectId}
            />
          ))}
        </List>
      );
    }

    if (isLoading) {
      loadingContent = (
        <SpinnerContainer>
          <Spinner size="medium" />
        </SpinnerContainer>
      );
    }

    return (
      <ListContainer>
        {itemsContent}
        {loadingContent}
      </ListContainer>
    );
  }
}
