import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import type { DocNode } from '@atlaskit/adf-schema';
import Renderer from '../../ui/Renderer';
import type { RendererProps } from '../../ui/renderer-props';

export const MediaBaseRenderer = ({
	adf,
	appearance = 'full-page',
	nodeComponents,
}: {
	adf: DocNode | Record<string, unknown>;
	appearance?: RendererProps['appearance'];
	nodeComponents?: RendererProps['nodeComponents'];
}): React.JSX.Element => {
	return (
		<MockMediaClientProvider>
			<Renderer
				document={adf as DocNode}
				appearance={appearance}
				adfStage={'stage0'}
				media={{ allowLinking: true, allowCaptions: true }}
				UNSTABLE_allowTableResizing={true}
				nodeComponents={nodeComponents}
			/>
		</MockMediaClientProvider>
	);
};
