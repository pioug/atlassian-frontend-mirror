import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import Renderer from '../../ui/Renderer';
import { mediaInlineAdf } from '../visual-regression/media/__fixtures__/media-inline.adf';
import { mediaInlineInParagraphAdf } from '../visual-regression/media/__fixtures__/media-inline-in-paragraph.adf';
import { mediaInlineMultipleInParagraphAdf } from '../visual-regression/media/__fixtures__/media-inline-multiple-in-paragraph.adf';
import type { DocNode } from '@atlaskit/adf-schema';
import { RendererProps } from '../../ui/renderer-props';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

const Media = ({
	adf,
	appearance,
	nodeComponents,
}: {
	adf: DocNode;
	appearance: string;
	nodeComponents?: RendererProps['nodeComponents'];
}) => {
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
					nodeComponents={nodeComponents}
				/>
			</MockMediaClientProvider>
		</div>
	);
};

export const MediaInlineADF = () => {
	return <Media adf={mediaInlineAdf} appearance={'full-page'} />;
};

export const MediaInlineInParagraphADF = () => {
	return <Media adf={mediaInlineInParagraphAdf} appearance={'full-page'} />;
};

export const MediaInlineMultipleInParagraphADF = () => {
	return <Media adf={mediaInlineMultipleInParagraphAdf} appearance={'full-page'} />;
};

export const MediaInlineADFWithReactLooselyLazy = () => {
	return (
		<Media
			adf={mediaInlineMultipleInParagraphAdf}
			appearance={'full-page'}
			nodeComponents={looselyLazyNodes}
		/>
	);
};
