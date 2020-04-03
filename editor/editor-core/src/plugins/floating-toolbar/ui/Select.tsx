import React from 'react';
import { Component, HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';

import Select, { ValueType } from '@atlaskit/select';

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface Props {
  hideExpandIcon?: boolean;
  options: SelectOption[];
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  defaultValue?: SelectOption;
  placeholder?: string;
  onChange?: (change: ValueType<SelectOption>) => void;
  width?: number;
}

export interface State {
  isOpen: boolean;
}

const SelectWrapper: ComponentClass<HTMLAttributes<{}> & {
  width: number;
}> = styled.div`
  width: ${props => props.width}px;
`;

export default class Search extends Component<Props, State> {
  state: State = { isOpen: false };
  render() {
    const {
      options,
      onChange,
      defaultValue,
      placeholder,
      width = 200,
    } = this.props;
    return (
      <SelectWrapper width={width}>
        <Select<SelectOption>
          options={options}
          value={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          spacing={'compact'}
          menuPlacement="auto"
        />
      </SelectWrapper>
    );
  }
}
