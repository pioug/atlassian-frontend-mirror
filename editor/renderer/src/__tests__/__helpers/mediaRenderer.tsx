import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import { Renderer } from '../../ui';
import type { RendererProps } from '../../ui/renderer-props';
import type { DocNode } from '@atlaskit/adf-schema';

export const MediaBaseRenderer = ({
	adf,
	appearance = 'full-page',
}: {
	adf: DocNode;
	appearance?: RendererProps['appearance'];
}) => {
	return (
		<MockMediaClientProvider>
			<Renderer
				document={adf}
				appearance={appearance}
				adfStage={'stage0'}
				media={{ allowLinking: true, allowCaptions: true }}
			/>
		</MockMediaClientProvider>
	);
};
