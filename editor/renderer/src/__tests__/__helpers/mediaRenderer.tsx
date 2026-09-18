import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';

import { Renderer } from '../../entry-points/renderer-default';
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
