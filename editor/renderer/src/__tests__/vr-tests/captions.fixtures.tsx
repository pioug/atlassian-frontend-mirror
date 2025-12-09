import React from 'react';

import { caption } from './__fixtures__/caption-adf';
import { captionLong } from './__fixtures__/caption-long-adf';
import { captionComplicated } from './__fixtures__/caption-complicated-adf';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

import Renderer from '../../ui/Renderer';
import type { DocNode } from '@atlaskit/adf-schema';

const Media = ({ adf, appearance }: { adf: DocNode; appearance: string }) => {
	return (
		<MockMediaClientProvider>
			<Renderer
				document={adf}
				// @ts-expect-error
				appearance={appearance}
				adfStage={'stage0'}
				media={{ allowLinking: true, allowCaptions: true }}
			/>
		</MockMediaClientProvider>
	);
};

export const Caption = (): React.JSX.Element => {
	return <Media adf={caption} appearance={'full-width'} />;
};

export const CaptionLong = (): React.JSX.Element => {
	return <Media adf={captionLong} appearance={'full-width'} />;
};

export const CaptionComplicated = (): React.JSX.Element => {
	return <Media adf={captionComplicated} appearance={'full-width'} />;
};
