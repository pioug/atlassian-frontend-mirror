import React from 'react';
import { AtlassianIcon } from '@atlaskit/logo';
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
            paddingLeft: 8,
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
  <Select
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
);

export default ElementBeforeExample;
