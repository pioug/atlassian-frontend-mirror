import React, { Component, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { Radio } from '../src';

const Tr = styled.tr<{ isChecked?: boolean }>`
  background-color: ${p => (p.isChecked ? colors.B50 : 'transparent')};
  transition: background-color 200ms ease-in-out;
`;

interface State {
  items: Array<any>;
  isActive: boolean;
  isChecked: boolean;
  isFocused: boolean;
  isMouseDown: boolean;
  value: string;
}

const items: Array<{
  id: number;
  value: string;
  name: string;
  description: string;
  commit: string;
  updated: string;
  isChecked?: boolean;
}> = [
  {
    id: 1,
    value: '1',
    name: 'branch',
    description: 'master',
    commit: 'dcc0f15',
    updated: '14 minutes ago',
    isChecked: true,
  },
  {
    id: 2,
    value: '2',
    name: 'branch',
    description: 'feature/dark-mode',
    commit: 'cbc0fa3',
    updated: '56 minutes ago',
  },
  {
    id: 3,
    value: '3',
    name: 'branch',
    description: 'feature/right-to-left',
    commit: '69568ea',
    updated: '16 hours ago',
  },
  {
    id: 4,
    value: '4',
    name: 'branch',
    description: 'bug/type-incorrect-for-checked-prop',
    commit: '1159c76',
    updated: 'yesterday',
  },
];

export default class RadioInputExample extends Component<any, State> {
  state = {
    items: items.slice(),
    value: '1',
    isActive: false,
    isChecked: false,
    isMouseDown: false,
    isFocused: false,
  };

  onBlur = () => {
    this.setState({
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
  };

  onFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  onChange = ({ currentTarget: { value } }: SyntheticEvent<any>) => {
    this.setChecked(value);
  };

  setChecked = (value: string) => {
    const newItems = this.state.items.slice().map(item => {
      if (item.value === value)
        return {
          ...item,
          isChecked: true,
        };
      return {
        ...item,
        isChecked: false,
      };
    });
    this.setState({
      items: newItems,
      value,
    });
  };

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th style={{ width: 0 }} />
              <th>Branch</th>
              <th>Last commit</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map(item => (
              <Tr
                isChecked={item.isChecked}
                onClick={() => this.setChecked(item.value)}
                key={`${item.value}${item.name}${item.id}`}
              >
                <td style={{ width: 24, paddingRight: 0 }}>
                  <Radio
                    isChecked={item.isChecked}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onChange={this.onChange}
                    name={item.name}
                    value={item.value}
                  />
                </td>
                <td>{item.description}</td>
                <td>{item.commit}</td>
                <td>{item.updated}</td>
              </Tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '1em 0',
          }}
        >
          currently selected value: {this.state.value}
        </div>
      </div>
    );
  }
}
