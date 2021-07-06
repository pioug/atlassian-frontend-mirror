import React, { useState } from 'react';

import { css } from '@emotion/core';

import Select, { ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const ReadViewContainer = css({
  display: 'flex',
  fontSize: `${fontSize}px`,
  height: `${(gridSize * 2.5) / fontSize}em`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
  maxWidth: '100%',
  padding: `${gridSize}px ${gridSize - 2}px`,
});

const EditViewContainer = css({
  zIndex: 300,
  position: 'relative',
});

interface OptionType {
  label: string;
  value: string;
}

const selectOptions = [
  { label: 'CSS', value: 'CSS' },
  { label: 'Design', value: 'Design' },
  { label: 'HTML', value: 'HTML' },
  { label: 'Javascript', value: 'Javascript' },
  { label: 'User Experience', value: 'User Experience' },
  { label: 'User Research', value: 'User Research' },
];

const InlineEditCustomSelectExample = () => {
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
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
      }}
    >
      <InlineEdit<ValueType<OptionType, true>>
        defaultValue={editValue}
        label="Skills required"
        editView={(fieldProps) => (
          <div css={EditViewContainer}>
            <Select
              {...fieldProps}
              options={selectOptions}
              isMulti
              autoFocus
              openMenuOnFocus
            />
          </div>
        )}
        readView={() =>
          editValue && editValue.length === 0 ? (
            <div css={ReadViewContainer}>Click to select options</div>
          ) : (
            <div style={{ padding: `${gridSize / 2}px` }}>
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

export default InlineEditCustomSelectExample;
