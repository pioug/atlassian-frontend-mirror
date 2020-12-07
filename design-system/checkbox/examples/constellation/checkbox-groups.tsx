/**  @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import { N500 } from '@atlaskit/theme/colors';
import Toggle from '@atlaskit/toggle';

import { Checkbox } from '../../src';

const CheckboxGroups = () => {
  const [flexDirection, setFlexDirection] = useState<'column' | 'row'>(
    'column',
  );

  const onClick = () => {
    switch (flexDirection) {
      case 'column': {
        setFlexDirection('row');
        break;
      }
      case 'row': {
        setFlexDirection('column');
        break;
      }
      default:
        break;
    }
  };

  return (
    <div>
      <div
        css={{
          borderStyle: 'dashed',
          borderWidth: '1px',
          backgroundColor: 'white',
          borderColor: '#ccc',
          padding: '0.5em',
          color: N500,
          margin: '0.5em',
        }}
      >
        <Toggle onChange={onClick} />
        <span
          css={{
            paddingLeft: '4px',
          }}
        >
          {flexDirection
            ? `flex-direction: ${flexDirection}`
            : `First two checkboxes change the flex-direction of the container div`}
        </span>
      </div>
      <div
        css={{
          display: 'flex',
          flexDirection: flexDirection,
          paddingBottom: '16px',
        }}
      >
        <Checkbox label="Chocolate" defaultChecked />
        <Checkbox label="Coffee" />
        <Checkbox label="Vanilla" />
      </div>
    </div>
  );
};

export default CheckboxGroups;
