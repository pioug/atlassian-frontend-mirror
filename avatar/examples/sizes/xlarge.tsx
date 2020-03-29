import React, { ReactNode } from 'react';
import Avatar from '../../src';

const Row: React.FunctionComponent<ReactNode> = ({ children }) => (
  <div css={{ display: 'flex' }}>{children}</div>
);

const Col: React.FunctionComponent<ReactNode> = ({ children }) => (
  <div css={{ flex: '1 1 auto' }}>{children}</div>
);

const XLarge = () => (
  <div>
    <Row>
      <Col>
        <p>Circular</p>
        <Avatar size="xlarge" />
      </Col>
      <Col>
        <p>Square</p>
        <Avatar size="xlarge" appearance="square" />
      </Col>
    </Row>
  </div>
);

export default XLarge;
