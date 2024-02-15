import React from 'react';

import { token } from '@atlaskit/tokens';

import { PlaceholderComponent } from '../src/ui/MacroComponent/PlaceholderComponent';

export default function PlaceholderComponentExample() {
  const url = 'https://image.url.here';
  const createPromise = () => ({
    submit: () =>
      new Promise((resolve, reject) => resolve({ placeholderDataUrl: url })),
  });
  const extension = {
    extensionKey: 'key',
    extensionType: 'macro',
    parameters: {
      macroMetadata: {
        placeholder: [
          {
            data: { url },
          },
        ],
      },
    },
  };
  const renderFallback = () => <></>;

  return (
    <div style={{ padding: `${token('space.600', '48px')}` }}>
      <PlaceholderComponent
        createPromise={createPromise}
        extension={extension}
        renderFallback={renderFallback}
      />
    </div>
  );
}
