/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';

import { ICON_SIZE_THRESOLD } from './constants';
import { Frame } from './frame';

type Props = {
	title?: string;
	testId?: string;
	/** Container height */
	height?: number;
};

export const InlineImageCardLoadingView = ({
	testId = 'media-inline-image-card-loading-view',
	height = ICON_SIZE_THRESOLD,
}: Props) => {
	return (
		<Frame testId={testId}>
			<Spinner size={height > ICON_SIZE_THRESOLD ? 'medium' : 'small'} />
		</Frame>
	);
};
