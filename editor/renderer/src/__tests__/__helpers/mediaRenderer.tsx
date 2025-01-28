import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import Renderer from '../../ui/Renderer';
import type { RendererProps } from '../../ui/renderer-props';
import type { DocNode } from '@atlaskit/adf-schema';

export const MediaBaseRenderer = ({
	adf,
	appearance = 'full-page',
	nodeComponents,
}: {
	adf: DocNode;
	appearance?: RendererProps['appearance'];
	nodeComponents?: RendererProps['nodeComponents'];
}) => {
	return (
		<MockMediaClientProvider>
			<Renderer
				document={adf}
				appearance={appearance}
				adfStage={'stage0'}
				media={{ allowLinking: true, allowCaptions: true }}
				UNSTABLE_allowTableResizing={true}
				nodeComponents={nodeComponents}
			/>
		</MockMediaClientProvider>
	);
};
