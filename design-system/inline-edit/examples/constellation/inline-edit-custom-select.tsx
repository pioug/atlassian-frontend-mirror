/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import {
  fontSize as getFontSize,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const containerStyles = xcss({
  paddingTop: 'space.100',
  paddingRight: 'space.100',
  paddingBottom: 'space.600',
});

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = xcss({
  display: 'flex',
  maxWidth: '100%',
  height: `${(gridSize * 2.5) / fontSize}em`,
  paddingBlock: 'space.100',
  paddingInline: 'space.075',
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
});

const editViewContainerStyles = xcss({
  position: 'relative',
  zIndex: 'dialog',
});

const tagGroupContainerStyles = xcss({ padding: 'space.050' });
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
    <Box xcss={containerStyles}>
      <InlineEdit<ValueType<OptionType, true>>
        defaultValue={editValue}
        label="Skills required"
        editView={(fieldProps) => (
          <Box xcss={editViewContainerStyles}>
            <Select
              {...fieldProps}
              options={selectOptions}
              isMulti
              autoFocus
              openMenuOnFocus
            />
          </Box>
        )}
        readView={() =>
          editValue && editValue.length === 0 ? (
            <Box xcss={readViewContainerStyles}>Click to select options</Box>
          ) : (
            <Box xcss={tagGroupContainerStyles}>
              <Group>
                {editValue &&
                  editValue.map((option: OptionType) => (
                    <Tag text={option.label} key={option.label} />
                  ))}
              </Group>
            </Box>
          )
        }
        onConfirm={onConfirm}
      />
    </Box>
  );
};

export default InlineEditCustomSelectExample;
