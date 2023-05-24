import React from 'react';

import { Label } from '@atlaskit/form';

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
          flexDirection: 'column',
        }}
      >
        <div>{option.label}</div>
        {option.description ? (
          <div
            style={{
              fontSize: 12,
              fontStyle: 'italic',
            }}
          >
            {option.description}
          </div>
        ) : null}
      </div>
    );
  }
  return option.label;
};
const OptionWithDescription = () => (
  <>
    <Label htmlFor="option-w-desc-example">Which city do you live in?</Label>
    <Select
      inputId="option-w-desc-example"
      formatOptionLabel={formatOptionLabel}
      options={[
        {
          label: 'Adelaide',
          value: 'adelaide',
          description: 'A nice place to live',
        },
        {
          label: 'Brisbane',
          value: 'brisbane',
          description: 'A boisterous and energetic city',
        },
        { label: 'Canberra', value: 'canberra', description: 'The capital' },
        { label: 'Darwin', value: 'darwin' },
        { label: 'Hobart', value: 'hobart', description: 'Scenic, and serene' },
        {
          label: 'Melbourne',
          value: 'melbourne',
          description: 'Charming, and cultured',
        },
        { label: 'Perth', value: 'perth', description: 'Lovely city' },
        {
          label: 'Sydney',
          value: 'sydney',
          description: 'Nothing good happens ever happens here',
        },
      ]}
    />
  </>
);

export default OptionWithDescription;
