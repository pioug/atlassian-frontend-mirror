/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import { CSSToken, token } from '../src';

const ExampleSizeBox = ({ scaleToken }: { scaleToken: CSSToken }) => {
  const boxStyles = xcss({
    width: scaleToken,
    height: scaleToken,
    backgroundColor: 'color.background.brand.bold',
  });

  return <Box xcss={boxStyles}></Box>;
};

export default () => {
  return (
    <div data-testid="spacing">
      <h1>Spacing scale</h1>
      <Inline space="space.100" alignBlock="end">
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
        <ExampleSizeBox scaleToken={token('space.025', '12px')} />
        <ExampleSizeBox scaleToken={token('space.050', '6px')} />
        <ExampleSizeBox scaleToken={token('space.075', '22px')} />
        <ExampleSizeBox scaleToken={token('space.100', '40px')} />
        <ExampleSizeBox scaleToken={token('space.150', '4rem')} />
        <ExampleSizeBox scaleToken={token('space.200', '32px')} />
        <ExampleSizeBox scaleToken={token('space.300', '12px')} />
        <ExampleSizeBox scaleToken={token('space.400', '2em')} />
        <ExampleSizeBox scaleToken={token('space.500', '52px')} />
        <ExampleSizeBox scaleToken={token('space.600', '0.5rem')} />
        <ExampleSizeBox scaleToken={token('space.800', '0.5rem')} />
        <ExampleSizeBox scaleToken={token('space.1000', '0.5rem')} />
      </Inline>
    </div>
  );
};
