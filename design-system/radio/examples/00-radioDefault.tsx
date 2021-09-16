import React, { SyntheticEvent, useCallback, useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';

import { RadioGroup } from '../src';
import { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
  { name: 'color', value: 'black', label: 'Black' },
];

export default function BasicExample() {
  const [isDisabled, setIsDisabled] = useState<boolean>();
  const [onChangeResult, setOnChangeResult] = useState<string>(
    'Click on a radio field to trigger onChange',
  );

  const onChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    setOnChangeResult(
      `onChange called with value: ${event.currentTarget.value}`,
    );
  }, []);

  const toggleCheckbox = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      setIsDisabled(event.currentTarget.checked);
    },
    [],
  );

  return (
    <div>
      <h4 id="radiogroup-label">Choose a color:</h4>
      <RadioGroup
        isDisabled={isDisabled}
        options={options}
        onChange={onChange}
        aria-labelledby="radiogroup-label"
      />
      <div
        style={{
          borderStyle: 'dashed',
          borderWidth: '1px',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          borderColor: '#ccc',
          padding: '0.5em',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          color: '#ccc',
          margin: '0.5em',
        }}
      >
        {onChangeResult}
      </div>
      <Checkbox
        value="isDisabled"
        label="is disabled"
        onChange={toggleCheckbox}
      />
    </div>
  );
}
