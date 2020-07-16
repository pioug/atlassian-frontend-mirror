import React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { fontSizeSmall } from '@atlaskit/theme';
import { ActivityItem } from '@atlaskit/activity-provider';
import { N20, N800, N100 } from '@atlaskit/theme/colors';

interface ContainerProps {
  selected: boolean;
}

const Container: ComponentClass<HTMLAttributes<{}> &
  ContainerProps> = styled.li`
  background-color: ${(props: ContainerProps) =>
    props.selected ? N20 : 'transparent'};
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  margin-top: 0; // This is to remove 4px one that comes from packages/css-packs/css-reset/src/base.ts:90
`;

const NameWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  overflow: hidden;
`;

export const Name: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${N800};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
`;

export const ContainerName: ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${N100};
  line-height: 14px;
  font-size: ${fontSizeSmall()}px;
`;

const Icon: ComponentClass<HTMLAttributes<{}>> = styled.span`
  min-width: 16px;
  margin-top: 3px;
  margin-right: 12px;
`;

export interface Props {
  item: ActivityItem;
  selected: boolean;
  onSelect: (href: string, text: string) => void;
  onMouseMove: (objectId: string) => void;
}

export default class RecentItem extends React.PureComponent<Props, {}> {
  handleSelect = (e: React.MouseEvent) => {
    e.preventDefault(); // don't let editor lose focus
    const { item, onSelect } = this.props;
    onSelect(item.url, item.name);
  };

  handleMouseMove = () => {
    const { onMouseMove, item } = this.props;
    onMouseMove(item.objectId);
  };

  render() {
    const { item, selected } = this.props;

    return (
      <Container
        selected={selected}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleSelect}
      >
        <Icon>
          <img src={item.iconUrl} />
        </Icon>
        <NameWrapper>
          <Name>{item.name}</Name>
          <ContainerName>{item.container}</ContainerName>
        </NameWrapper>
      </Container>
    );
  }
}
