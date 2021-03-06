/**  @jsx jsx */
import { ChangeEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function UncontrolledExample() {
  const [onChangeResult, setOnChangeResult] = useState(
    'Check & Uncheck to trigger onChange',
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOnChangeResult(`isChecked in state: ${event.target.checked}`);
  }, []);

  return (
    <div>
      <Checkbox
        onChange={onChange}
        label="Uncontrolled Checkbox"
        value="Uncontrolled Checkbox"
        name="uncontrolled-checkbox"
      />

      <div
        css={{
          borderStyle: 'dashed',
          borderWidth: '1px',
          borderColor: '#ccc',
          padding: '0.5em',
          margin: '0.5em',
          color: '#ccc',
        }}
      >
        {onChangeResult}
      </div>
    </div>
  );
}
