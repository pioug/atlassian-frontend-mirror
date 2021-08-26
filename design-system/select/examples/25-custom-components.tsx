/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useState } from 'react';

import Select, { components } from '../src';
import type {
  OptionProps,
  SingleValueProps,
  ValueType,
} from '@atlaskit/select/types';

interface OptionType {
  label: string;
  value: string;
}

const colors = [
  { label: 'blue', value: 'blue' },
  { label: 'red', value: 'red' },
  { label: 'purple', value: 'purple' },
  { label: 'black', value: 'black' },
  { label: 'white', value: 'white' },
  { label: 'gray', value: 'gray' },
  { label: 'yellow', value: 'yellow' },
  { label: 'orange', value: 'orange' },
  { label: 'teal', value: 'teal' },
];

const ColorBox = ({ color }: { color: string }) => (
  <span
    style={{
      width: '10px',
      height: '10px',
      backgroundColor: color,
      display: 'inline-block',
      marginRight: 8,
      marginBottom: 4,
      verticalAlign: 'middle',
    }}
  />
);

type ColorOption = typeof colors[number];

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomColorOption: React.FC<OptionProps<ColorOption>> = ({
  children,
  ...props
}) => (
  <components.Option {...props}>
    <ColorBox color={children as string} /> {children}
  </components.Option>
);

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomValueOption: React.FC<SingleValueProps<ColorOption>> = ({
  children,
  ...props
}) => (
  <components.SingleValue {...props}>
    <ColorBox color={children as string} /> {children}
  </components.SingleValue>
);

export default () => {
  const [value, setValue] = useState<ValueType<OptionType>>();
  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Select<OptionType>
        value={value}
        onChange={(val) => setValue(val)}
        inputId="colors-example"
        components={{
          Option: CustomColorOption,
          SingleValue: CustomValueOption,
        }}
        options={colors}
        isClearable
      />
    </div>
  );
};
