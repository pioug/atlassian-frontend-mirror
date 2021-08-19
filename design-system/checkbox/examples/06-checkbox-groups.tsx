/**  @jsx jsx */
import { ChangeEvent, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function CheckboxGroups() {
  const [flexDirection, setFlexDirection] = useState<
    'column' | 'row' | undefined
  >('column');

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    switch (event.currentTarget.value) {
      case 'column':
        setFlexDirection(event.currentTarget.checked ? 'column' : undefined);
        break;
      case 'row':
        setFlexDirection(event.currentTarget.checked ? 'row' : undefined);
        break;
      default:
        break;
    }
  }, []);

  return (
    <div>
      <div
        css={{
          display: 'flex',
          flexDirection: flexDirection,
        }}
      >
        <Checkbox
          isDisabled={flexDirection === 'row'}
          label="Flex-direction: column"
          value="column"
          defaultChecked
          onChange={onChange}
        />
        <Checkbox
          isDisabled={flexDirection === 'column'}
          label="Flex-direction: row"
          value="row"
          onChange={onChange}
        />
        <Checkbox
          isDisabled
          label="Disabled"
          value="Disabled"
          onChange={onChange}
          name="checkbox-disabled"
        />
        <Checkbox
          isInvalid
          label="Invalid"
          value="Invalid"
          onChange={onChange}
          name="checkbox-invalid"
        />
      </div>
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
        {flexDirection
          ? `flex-direction: ${flexDirection}`
          : `First two checkboxes change the flex-direction of the container div`}
      </div>
    </div>
  );
}
