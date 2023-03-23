// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';

import { CSSToken, token } from '../src';

const RadiusBox = ({ radius }: { radius: CSSToken }) => (
  <Box
    UNSAFE_style={{ borderRadius: radius }}
    borderColor="color.border"
    borderWidth="2px"
    borderStyle="solid"
    width="size.400"
    height="size.400"
    alignItems="center"
    justifyContent="center"
  />
);

export default () => {
  return (
    <div data-testid="shape">
      <h1>Shape scale</h1>
      <Inline space="100" alignBlock="end">
        <RadiusBox radius={token('border.radius.050', '2px')} />
        <RadiusBox radius={token('border.radius.100', '4px')} />
        <RadiusBox radius={token('border.radius.200', '8px')} />
        <RadiusBox radius={token('border.radius.300', '12px')} />
        <RadiusBox radius={token('border.radius.400', '16px')} />
        <RadiusBox radius={token('border.radius.round', '50%')} />
      </Inline>
    </div>
  );
};
