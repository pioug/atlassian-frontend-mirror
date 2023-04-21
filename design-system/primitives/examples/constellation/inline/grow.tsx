/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Code } from '@atlaskit/code';
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
  display: 'flex',
});
const boxStyles = css({
  padding: token('space.100', '8px'),
  flexGrow: 1,
  backgroundColor: token('color.background.discovery', '#EAE6FF'),
});

export default function Example() {
  return (
    <Stack space="space.200">
      {(['hug', 'fill'] as const).map(growValue => (
        <div css={containerStyles}>
          <Inline grow={growValue}>
            <div css={boxStyles}>
              Wrapping <Code>Inline</Code> is set to{' '}
              <Code>grow="{growValue}"</Code>
            </div>
          </Inline>
        </div>
      ))}
    </Stack>
  );
}
