import React from 'react';
import styled from 'styled-components';
import { typography } from '../src';

const Heading = styled.div<{ mixin: any }>`
  ${props => props.mixin};
`;

export default () => {
  return (
    <React.Fragment>
      <Heading mixin={typography.h100()}>h100</Heading>
      <Heading mixin={typography.h200()}>h200</Heading>
      <Heading mixin={typography.h300()}>h300</Heading>
      <Heading mixin={typography.h400()}>h400</Heading>
      <Heading mixin={typography.h500()}>h500</Heading>
      <Heading mixin={typography.h600()}>h600</Heading>
      <Heading mixin={typography.h700()}>h700</Heading>
      <Heading mixin={typography.h800()}>h800</Heading>
      <Heading mixin={typography.h900()}>h900</Heading>
    </React.Fragment>
  );
};
