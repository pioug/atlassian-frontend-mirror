// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
} from '@atlaskit/ds-explorations';

import { CSSToken, token } from '../src';

// Theme mounted to the page as css files
import '../css/atlassian-spacing.css';

const ExampleSizeBox = ({ scaleToken }: { scaleToken: CSSToken }) => (
  <Box
    backgroundColor={['brand.bold', '#0052CC']}
    // These should be updated to use a Box prop directly instead of UNSAFE_style once Box takes tokens
    UNSAFE_style={{
      width: scaleToken,
      height: scaleToken,
    }}
  ></Box>
);

export default () => {
  useEffect(() => {
    const element = document.documentElement;
    element.setAttribute('data-spacing-theme', 'spacing');
  }, []);

  return (
    <div>
      <h1>Spacing scale</h1>
      <Inline gap="sp-100" alignItems="flexEnd">
        <ExampleSizeBox scaleToken={token('spacing.scale.025')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.050')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.075')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.100')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.150')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.200')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.300')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.400')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.500')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.600')} />
      </Inline>
    </div>
  );
};
