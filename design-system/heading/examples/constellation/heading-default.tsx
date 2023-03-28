/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Heading from '../../src';

const wrapperStyles = css({
  display: 'flex',
  rowGap: token('space.100', '8px'),
  flexDirection: 'column',
});

export default () => {
  return (
    <div css={wrapperStyles}>
      <Heading level="h900">H900 (I'm h1)</Heading>
      <Heading level="h800">H800 (I'm h1)</Heading>
      <Heading level="h700">H700 (I'm h2)</Heading>
      <Heading level="h600">H600 (I'm h3)</Heading>
      <Heading level="h500">H500 (I'm h4)</Heading>
      <Heading level="h400">H400 (I'm h5)</Heading>
      <Heading level="h300">H300 (I'm h6)</Heading>
      <Heading level="h200">H200 (I'm div)</Heading>
      <Heading level="h100">H100 (I'm div)</Heading>
    </div>
  );
};
