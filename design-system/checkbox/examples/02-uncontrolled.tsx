/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/**  @jsx jsx */
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function UncontrolledExample() {
  const [onChangeResult, setOnChangeResult] = useState(
    'Check & Uncheck to trigger onChange',
  );
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOnChangeResult(`isChecked in state: ${event.target.checked}`);
  }, []);
  const [onClickResult, setOnClickResult] = useState(
    'Hold shift/alt/cmd (or windows key) when clicking to test those alternative clicks',
  );

  const onClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
    const meta = event.metaKey ? 'Cmd/Windows key + ' : '';
    const alt = event.altKey ? 'Alt + ' : '';
    const shift = event.shiftKey ? 'Shift + ' : '';
    const result = `type of click: ${meta}${alt}${shift}click`;
    setOnClickResult(result);
  }, []);

  return (
    <div>
      <Checkbox
        onChange={onChange}
        onClick={onClick}
        label="Uncontrolled Checkbox"
        value="Uncontrolled Checkbox"
        name="uncontrolled-checkbox"
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
        {onClickResult}
      </div>
    </div>
  );
}
