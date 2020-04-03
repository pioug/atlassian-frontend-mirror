import React from 'react';
import { PureComponent } from 'react';
import { ActivityItem } from '@atlaskit/activity';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import RecentItem from './RecentItem';

const Container = styled.div`
  padding-top: 10px;
`;

const ListContainer = styled.div`
  padding-top: 0;
`;

const SpinnerContainer = styled.div`
  text-align: center;
  min-height: 80px;
  margin-top: 30px;
`;

const List = styled.ul`
  padding: 0;
  list-style: none;
`;

export interface Props {
  items?: Array<ActivityItem>;
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (href: string, text: string) => void;
  onMouseMove: (objectId: string) => void;
}

export default class RecentList extends PureComponent<Props, {}> {
  render() {
    const {
      onSelect,
      onMouseMove,
      items,
      selectedIndex,
      isLoading,
    } = this.props;

    if (isLoading) {
      return (
        <Container>
          <SpinnerContainer>
            <Spinner invertColor={true} size="medium" />
          </SpinnerContainer>
        </Container>
      );
    }

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <ListContainer>
        <List>
          {items.map((item, index) => (
            <RecentItem
              item={item}
              selected={selectedIndex === index}
              onMouseMove={onMouseMove}
              onSelect={onSelect}
              key={item.objectId}
            />
          ))}
        </List>
      </ListContainer>
    );
  }
}
