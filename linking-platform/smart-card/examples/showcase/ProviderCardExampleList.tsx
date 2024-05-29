import React from 'react';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { type ExampleUrl, type ExampleUIConfig } from './types';
import { ProviderCardExampleWithErrorBoundary } from './ProviderCardExampleWithErrorBoundaryProps';

export const ProviderCardExampleList = ({
  examples,
  config,
}: {
  examples: ExampleUrl['examples'];
  config: ExampleUIConfig;
}): JSX.Element => {
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ marginTop: token('space.300', '24px') }}>
      {examples.map((example) => {
        return (
          <div
            key={example.displayName}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            style={{ marginTop: token('space.300', '24px') }}
          >
            <h6
              style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
                textTransform: 'uppercase',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
