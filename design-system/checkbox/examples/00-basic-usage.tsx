/**  @jsx jsx */
import { ChangeEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function BasicUsageExample() {
  const [onChangeResult, setOnChangeResult] = useState(
    'Check & Uncheck to trigger onChange',
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const message = `onChange called with value: ${event.target.value} isChecked: ${event.target.checked}`;
    console.log(message);
    setOnChangeResult(message);
  }, []);

  return (
    <div>
      <Checkbox
        value="Basic checkbox"
        label="Basic checkbox"
        onChange={onChange}
        name="checkbox-basic"
        testId="cb-basic"
      />
      <Checkbox
        defaultChecked
        label="Checked by default"
        value="Checked by default"
        onChange={onChange}
        name="checkbox-checked"
        testId="cb-default-checked"
      />
      <Checkbox
        isDisabled
        label="Disabled"
        value="Disabled"
        onChange={onChange}
        name="checkbox-disabled"
        testId="cb-disabled"
      />
      <Checkbox
        isInvalid
        label="Invalid"
        value="Invalid"
        onChange={onChange}
        name="checkbox-invalid"
        testId="cb-invalid"
      />

      <div
        css={{
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
    </div>
  );
}
