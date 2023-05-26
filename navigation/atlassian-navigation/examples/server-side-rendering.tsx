/** @jsx jsx */

import { jsx } from '@emotion/react';
import ReactDOMServer from 'react-dom/server';

import { Stack } from '@atlaskit/primitives';

import AuthenticatedExample from './10-authenticated-example';

export default function Component() {
  return (
    <Stack space="space.300">
      <Stack space="space.100">
        <h2>SSR</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(<AuthenticatedExample />),
          }}
        />
      </Stack>
      <Stack space="space.100">
        <h2>Hydrated</h2>
        <AuthenticatedExample />
      </Stack>
    </Stack>
  );
}
