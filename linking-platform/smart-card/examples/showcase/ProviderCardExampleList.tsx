import React from 'react';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { ExampleUrl, ExampleUIConfig } from './types';
import { ProviderCardExampleWithErrorBoundary } from './ProviderCardExampleWithErrorBoundaryProps';

export const ProviderCardExampleList = ({
  examples,
  config,
}: {
  examples: ExampleUrl['examples'];
  config: ExampleUIConfig;
}): JSX.Element => {
  return (
    <div style={{ marginTop: token('space.300', '24px') }}>
      {examples.map((example) => {
        return (
          <div
            key={example.displayName}
            style={{ marginTop: token('space.300', '24px') }}
          >
            <h6
              style={{
                textTransform: 'uppercase',
                color: token('color.text.subtle', N300),
              }}
            >
              {example.displayName}
            </h6>
            {example.urls.map((url) => (
              <p key={url}>
                <ProviderCardExampleWithErrorBoundary
                  config={config}
                  url={url}
                />
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
};
