import React from 'react';

import { Label } from '@atlaskit/form';
import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

import Select, { OptionType, FormatOptionLabelMeta } from '../src';

const formatOptionLabel = (
  option: OptionType,
  { context }: FormatOptionLabelMeta<OptionType>,
) => {
  if (context === 'menu') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AtlassianIcon size="small" />
        <span
          style={{
            paddingLeft: token('space.100', '8px'),
            paddingBottom: 0,
          }}
        >
          {option.label}
        </span>
      </div>
    );
  }
  return option.label;
};
const ElementBeforeExample = () => (
  <>
    <Label htmlFor="element-before-example">Which city do you live in?</Label>
    <Select
      inputId="element-before-example"
      formatOptionLabel={formatOptionLabel}
      options={[
        { label: 'Adelaide', value: 'adelaide' },
        { label: 'Brisbane', value: 'brisbane' },
        { label: 'Canberra', value: 'canberra' },
        { label: 'Darwin', value: 'darwin' },
        { label: 'Hobart', value: 'hobart' },
        { label: 'Melbourne', value: 'melbourne' },
        { label: 'Perth', value: 'perth' },
        { label: 'Sydney', value: 'sydney' },
      ]}
    />
  </>
);

export default ElementBeforeExample;
