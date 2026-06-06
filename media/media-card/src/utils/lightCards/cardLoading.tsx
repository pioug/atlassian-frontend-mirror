import React from 'react';
import SpinnerIcon from '@atlaskit/spinner';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { LoadingBar } from '../../card/ui/loadingBar/loadingBar';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';
import { Wrapper } from './lightCardWrappers';
import { type StaticCardProps } from './types';

export const CardLoading = ({
	dimensions: dimensionsProp,
	testId,
	interactionName,
}: StaticCardProps): React.JSX.Element => {
	const dimensions = getDimensionsWithDefault(dimensionsProp);

	return (
		<Wrapper
			data-testid={testId || 'media-card-loading'}
			data-test-loading
			dimensions={dimensions}
			data-vc="media-card-loading"
		>
			{expValEquals('cc-maui-ai-edit-loading-experiment', 'isEnabled', true) ? (
				<LoadingBar interactionName={interactionName || 'media-card-loading'} />
			) : (
				<SpinnerIcon interactionName={interactionName || 'media-card-loading'} />
			)}
		</Wrapper>
	);
};
