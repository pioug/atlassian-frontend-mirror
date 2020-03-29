import React from 'react';
import { Container, Format } from '../src';

export default () => {
  return (
    <Container backgroundColor="#FF5630" textColor="#fff">
      <em>
        <Format max={1000}>{1001}</Format>
      </em>
    </Container>
  );
};
