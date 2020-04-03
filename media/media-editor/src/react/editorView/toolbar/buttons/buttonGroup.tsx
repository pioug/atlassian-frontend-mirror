import React from 'react';
import { Group, GroupItem } from './styles';

export class ButtonGroup extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <Group>
        {React.Children.map(children, (child, idx) => {
          if (!child) {
            return null;
          }
          return <GroupItem key={idx}>{child}</GroupItem>;
        })}
      </Group>
    );
  }
}
