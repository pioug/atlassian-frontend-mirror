import React from 'react';
import styled from 'styled-components';
import Select, { ValueType } from '@atlaskit/select';
import Group from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  padding: ${gridSize()}px ${gridSize() - 2}px;
`;

const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
`;

interface OptionType {
  label: string;
  value: string;
}

const selectOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Cherry', value: 'Cherry' },
  { label: 'Mango', value: 'Mango' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Strawberry', value: 'Strawberry' },
  { label: 'Watermelon', value: 'Watermelon' },
];

interface State {
  editValue: OptionType[];
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: [],
  };

  onConfirm = (value: ValueType<OptionType>) => {
    if (!value) return;

    this.setState({
      editValue: value as OptionType[],
    });
  };

  render() {
    return (
      <div
        style={{
          padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
        }}
      >
        <InlineEdit<ValueType<OptionType>>
          defaultValue={this.state.editValue}
          label="Inline edit select"
          editView={fieldProps => (
            <EditViewContainer>
              <Select<OptionType>
                {...fieldProps}
                options={selectOptions}
                isMulti
                autoFocus
                openMenuOnFocus
              />
            </EditViewContainer>
          )}
          readView={() =>
            this.state.editValue.length === 0 ? (
              <ReadViewContainer>Click to choose options</ReadViewContainer>
            ) : (
              <div style={{ padding: `${gridSize() / 2}px` }}>
                <Group>
                  {this.state.editValue.map((option: OptionType) => (
                    <Tag text={option.label} key={option.label} />
                  ))}
                </Group>
              </div>
            )
          }
          onConfirm={this.onConfirm}
        />
      </div>
    );
  }
}
