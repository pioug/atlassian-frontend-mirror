import React from 'react';
import { N300 } from '@atlaskit/theme/colors';
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
    <div style={{ marginTop: '24px' }}>
      {examples.map((example) => {
        return (
          <div key={example.displayName} style={{ marginTop: '24px' }}>
            <h6
              style={{
                textTransform: 'uppercase',
                color: N300,
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
