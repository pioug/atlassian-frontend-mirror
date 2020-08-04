import React, { useState } from 'react';

import styled from 'styled-components';

import { N500 } from '@atlaskit/theme/colors';
import Toggle from '@atlaskit/toggle';

import { Checkbox } from '../../src';

const GroupDiv = styled.div`
  display: flex;
  flex-direction: ${(prop: { flexDirection: string }) => prop.flexDirection};
  padding-bottom: 16px;
`;

const CheckboxGroups = () => {
  const [flexDirection, setFlexDirection] = useState('column');

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
        style={{
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
      <GroupDiv flexDirection={flexDirection}>
        <Checkbox label="Chocolate" defaultChecked />
        <Checkbox label="Coffee" />
        <Checkbox label="Vanilla" />
      </GroupDiv>
    </div>
  );
};

export default CheckboxGroups;
