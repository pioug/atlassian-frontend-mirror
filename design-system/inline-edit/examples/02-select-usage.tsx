import React, { useState } from 'react';

import styled from '@emotion/styled';

import Select, { ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  padding: ${token('space.100', '8px')} ${token('space.075', '6px')};
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

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState<ValueType<OptionType, true>>([]);

  const onConfirm = (value: ValueType<OptionType, true>) => {
    if (!value) {
      return;
    }

    setEditValue(value);
  };

  return (
    <div
      style={{
        padding: `${token('space.100', '8px')} ${token(
          'space.100',
          '8px',
        )} ${token('space.600', '48px')}`,
      }}
    >
      <InlineEdit<ValueType<OptionType, true>>
        defaultValue={editValue}
        label="Inline edit select"
        editView={(fieldProps) => (
          <EditViewContainer>
            <Select
              {...fieldProps}
              options={selectOptions}
              isMulti
              autoFocus
              openMenuOnFocus
            />
          </EditViewContainer>
        )}
        readView={() =>
          editValue && editValue.length === 0 ? (
            <ReadViewContainer>Click to choose options</ReadViewContainer>
          ) : (
            <div style={{ padding: token('space.050', '4px') }}>
              <Group>
                {editValue &&
                  editValue.map((option: OptionType) => (
                    <Tag text={option.label} key={option.label} />
                  ))}
              </Group>
            </div>
          )
        }
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default InlineEditExample;
