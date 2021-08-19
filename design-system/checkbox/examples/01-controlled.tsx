/**  @jsx jsx */
import { ChangeEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function ControlledExample() {
  const [isChecked, setIsChecked] = useState(false);
  const [onChangeResult, setOnChangeResult] = useState(
    'Check & Uncheck to trigger onChange',
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked((current) => !current);
    setOnChangeResult(`props.isChecked: ${event.target.checked}`);
  }, []);

  return (
    <div>
      <Checkbox
        isChecked={isChecked}
        onChange={onChange}
        label="Controlled Checkbox"
        value="Controlled Checkbox"
        name="controlled-checkbox"
      />

      <div
        css={{
          borderStyle: 'dashed',
          borderWidth: '1px',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          borderColor: '#ccc',
          padding: '0.5em',
          margin: '0.5em',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          color: '#ccc',
        }}
      >
        {onChangeResult}
      </div>
    </div>
  );
}
