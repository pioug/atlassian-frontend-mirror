import React, { useState } from 'react';

import styled from '@emotion/styled';

import Range from '../src';

const Container = styled.div`
  width: 500px;
`;

const max = 100000;

function MassiveRangeTest() {
  const [value, setValue] = useState(0);

  const onChange = (value: any) => {
    setValue(value);
  };

  return (
    <div>
      <Container>
        <Range max={100000} step={1} onChange={onChange} />
        Value:{value}
      </Container>
      <div
        style={{
          borderStyle: 'dashed',
          borderWidth: '1px',
          borderColor: '#ccc',
          padding: '0.5em',
          color: '#ccc',
          margin: '0.5em',
        }}
      >
        Range: 0-{max} | Step: 1 |
        {value
          ? ` onChange called with value ${value}`
          : ' Interact to trigger onChange'}
      </div>
    </div>
  );
}

export default MassiveRangeTest;
