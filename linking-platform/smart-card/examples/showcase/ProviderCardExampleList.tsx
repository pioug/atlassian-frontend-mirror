import React from 'react';

import { token } from '@atlaskit/tokens';

import { ProviderCardExampleWithErrorBoundary } from './ProviderCardExampleWithErrorBoundaryProps';
import { type ExampleUIConfig, type ExampleUrl } from './types';

export const ProviderCardExampleList = ({
	examples,
	config,
}: {
	config: ExampleUIConfig;
	examples: ExampleUrl['examples'];
}): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ marginTop: token('space.300') }}>
			{examples.map((example) => {
				return (
					<div
						key={example.displayName}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginTop: token('space.300') }}
					>
						<h6
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								textTransform: 'uppercase',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								color: token('color.text.subtle'),
							}}
						>
							{example.displayName}
						</h6>
						{example.urls.map((url) => (
							<p key={url}>
								<ProviderCardExampleWithErrorBoundary config={config} url={url} />
							</p>
						))}
					</div>
				);
			})}
		</div>
	);
};
