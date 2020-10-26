import React, { PureComponent } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Label } from '@atlaskit/field-base';
import Item, { ItemGroup } from '@atlaskit/item';

import DropList from '../src';

export default class BasicExample extends PureComponent {
  state = {
    eventResult: 'Click into and out of the content to trigger event handlers',
    isOpen: false,
  };

  onKeyDown = () => {
    this.setState({
      eventResult: 'onKeyDown called',
    });
  };

  onClick = () => {
    this.setState({
      eventResult: 'onClick called',
      isOpen: !this.state.isOpen,
    });
  };

  onOpenChange = () => {
    this.setState({
      eventResult: 'onOpenChange called',
      isOpen: false,
    });
  };

  onItemActivated = () => {
    this.setState({
      eventResult: 'Item onActivated called',
    });
  };

  render() {
    return (
      <div>
        <Label label="With event handlers" />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.eventResult}
        </div>
        <DropList
          appearance="default"
          position="right top"
          isTriggerNotTabbable
          onOpenChange={this.onOpenChange}
          onClick={this.onClick}
          isOpen={this.state.isOpen}
          trigger={<Button>...</Button>}
          testId="droplist"
        >
          <ItemGroup title="Australia">
            <Item href="//atlassian.com" target="_blank">
              Sydney
            </Item>
            <Item isHidden>Hidden item</Item>
            <Item isDisabled>Brisbane</Item>
            <Item onActivated={this.onItemActivated}>Melbourne</Item>
          </ItemGroup>
        </DropList>
      </div>
    );
  }
}
