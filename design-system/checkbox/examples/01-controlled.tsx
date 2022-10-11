/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/**  @jsx jsx */
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import { Checkbox } from '../src';

export default function ControlledExample() {
  const [isChecked, setIsChecked] = useState(false);
  const [onChangeResult, setOnChangeResult] = useState(
    'Check & Uncheck to trigger onChange',
  );
  const [onClickResult, setOnClickResult] = useState(
    'Hold shift/alt/cmd (or windows key) when clicking to test those alternative clicks',
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked((current) => !current);
    const result = `props.isChecked: ${event.target.checked}`;
    setOnChangeResult(result);
  }, []);

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
        isChecked={isChecked}
        onClick={onClick}
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
