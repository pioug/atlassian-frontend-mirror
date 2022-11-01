/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import styled from '@emotion/styled';

import { useState } from 'react';
import { Provider, Card, Client } from '../src';

const client = new Client('stg');

const Button = styled.button`
  width: 150px;
  height: 60px;
  margin: 20px;
  font-size: 16px;
  background-color: token('color.background.neutral.subtle.hovered', n20a);
  border: 2px solid transparent;
  color: #a0a09d;
  border-radius: 5px;
  cursor: pointer;
`;

const Buttons = styled.div`
  display: flex;
`;

export default () => {
  const [url, setUrl] = useState('https://google.com');

  const changeUrl = () => {
    if (url === 'https://google.com') {
      setUrl('https://youtube.com');
    } else {
      setUrl('https://google.com');
    }
  };

  return (
    <Provider client={client}>
      <div style={{ width: '680px', margin: '0 auto', marginTop: '64px' }}>
        <Card appearance="block" url="https://youtube.com" />
        <br />
        <Card appearance="block" url={url} />
        <br />
        <Buttons>
          <Button onClick={changeUrl}> Change URL to Youtube </Button>
          <br />
          <Button onClick={changeUrl}> Change URL to Google </Button>
        </Buttons>
      </div>
    </Provider>
  );
};
