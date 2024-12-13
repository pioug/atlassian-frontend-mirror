import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

import { adfMediaWrappedLeft } from '../__fixtures__/media-pixel-width';
import Renderer from '../../ui/Renderer';

const Media = ({ adf, appearance }: { adf: Record<string, unknown>; appearance: string }) => {
	return (
		<MockMediaClientProvider>
			<Renderer
				// @ts-expect-error
				document={adf}
				// @ts-expect-error
				appearance={appearance}
				adfStage={'stage0'}
				media={{ allowLinking: true, allowCaptions: true }}
			/>
		</MockMediaClientProvider>
	);
};

export const MediaWrappedLeftFullWidth = () => {
	return <Media adf={adfMediaWrappedLeft} appearance={'full-width'} />;
};

export const MediaWrappedLeftFullPage = () => {
	return <Media adf={adfMediaWrappedLeft} appearance={'full-page'} />;
};
