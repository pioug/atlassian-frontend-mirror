import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

import { Renderer } from '../../entry-points/renderer-default';
import { adfMediaWrappedLeft } from '../__fixtures__/media-pixel-width';

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

export const MediaWrappedLeftFullWidth = (): React.JSX.Element => {
	return <Media adf={adfMediaWrappedLeft} appearance={'full-width'} />;
};

export const MediaWrappedLeftFullPage = (): React.JSX.Element => {
	return <Media adf={adfMediaWrappedLeft} appearance={'full-page'} />;
};
