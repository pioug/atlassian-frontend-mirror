import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import { Renderer } from '../../ui';
import { borderADF } from '../visual-regression/media/__fixtures__/media-border.adf';
import { borderADFWithinTable } from '../visual-regression/media/__fixtures__/media-border-within-table.adf';
import { borderADFWithLink } from '../visual-regression/media/__fixtures__/media-border-with-link.adf';
import type { DocNode } from '@atlaskit/adf-schema';

const Media = ({ adf, appearance }: { adf: DocNode; appearance: string }) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '10px' }}>
			<MockMediaClientProvider>
				<Renderer
					document={adf}
					// @ts-expect-error
					appearance={appearance}
					adfStage={'stage0'}
					media={{ allowLinking: true, allowCaptions: true }}
				/>
			</MockMediaClientProvider>
		</div>
	);
};

export const MediaBorderADF = () => {
	return <Media adf={borderADF} appearance={'full-page'} />;
};

export const MediaBorderWithinTableADF = () => {
	return <Media adf={borderADFWithinTable} appearance={'full-page'} />;
};

export const MediaBorderWithLinkADF = () => {
	return <Media adf={borderADFWithLink} appearance={'full-page'} />;
};
