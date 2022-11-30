// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
} from '@atlaskit/ds-explorations';

import { CSSToken, token } from '../src';

const ExampleSizeBox = ({ scaleToken }: { scaleToken: CSSToken }) => (
  <Box
    backgroundColor="brand.bold"
    // These should be updated to use a Box prop directly instead of UNSAFE_style once Box takes tokens
    UNSAFE_style={{
      width: scaleToken,
      height: scaleToken,
    }}
  ></Box>
);

export default () => {
  return (
    <div data-testid="spacing">
      <h1>Spacing scale</h1>
      <Inline gap="scale.100" alignItems="flexEnd">
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
        <ExampleSizeBox scaleToken={token('spacing.scale.025', '12px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.050', '6px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.075', '22px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.100', '40px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.150', '4rem')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.200', '32px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.300', '12px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.400', '2em')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.500', '52px')} />
        <ExampleSizeBox scaleToken={token('spacing.scale.600', '0.5rem')} />
      </Inline>
    </div>
  );
};
