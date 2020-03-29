import React, { Component } from 'react';
import styled from 'styled-components';
import { Checkbox } from '../src';

const GroupDiv = styled.div`
  display: flex;
  flex-direction: ${(prop: { flexDirection: string }) => prop.flexDirection};
`;

export default class CheckboxGroups extends Component<
  void,
  { flexDirection?: string }
> {
  state = {
    flexDirection: 'column',
  };
  onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    switch (event.currentTarget.value) {
      case 'column':
        this.setState({
          flexDirection: event.currentTarget.checked ? 'column' : undefined,
        });
        break;
      case 'row':
        this.setState({
          flexDirection: event.currentTarget.checked ? 'row' : undefined,
        });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <GroupDiv flexDirection={this.state.flexDirection}>
          <Checkbox
            isDisabled={this.state.flexDirection === 'row'}
            label="Flex-direction: column"
            value="column"
            defaultChecked
            onChange={this.onChange}
          />
          <Checkbox
            isDisabled={this.state.flexDirection === 'column'}
            label="Flex-direction: row"
            value="row"
            onChange={this.onChange}
          />
          <Checkbox
            isDisabled
            label="Disabled"
            value="Disabled"
            onChange={this.onChange}
            name="checkbox-disabled"
          />
          <Checkbox
            isInvalid
            label="Invalid"
            value="Invalid"
            onChange={this.onChange}
            name="checkbox-invalid"
          />
        </GroupDiv>
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
          {this.state.flexDirection
            ? `flex-direction: ${this.state.flexDirection}`
            : `First two checkboxes change the flex-direction of the container div`}
        </div>
      </div>
    );
  }
}
