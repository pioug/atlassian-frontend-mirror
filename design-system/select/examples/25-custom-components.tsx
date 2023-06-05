/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';

import Select, { components } from '../src';
import type {
  OptionProps,
  SingleValueProps,
  ValueType,
} from '@atlaskit/select';

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
      marginRight: token('space.100', '8px'),
      marginBottom: token('space.050', '4px'),
      verticalAlign: 'middle',
    }}
  />
);

type ColorOption = (typeof colors)[number];

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomColorOption = ({
  children,
  ...props
}: OptionProps<ColorOption>) => (
  <components.Option {...props}>
    <ColorBox color={children as string} /> {children}
  </components.Option>
);

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomValueOption = ({
  children,
  ...props
}: SingleValueProps<ColorOption, false>) => (
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
      <Label htmlFor="colors-example">Custom components</Label>
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
