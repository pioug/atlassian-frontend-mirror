/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Spinner from '@atlaskit/spinner';

import type { MediaSvgProps } from './types';

const loadingStyles = css({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
});

export type LoadingProps = {
	dimensions: MediaSvgProps['dimensions'];
};
export const Loading = ({ dimensions: { width, height } = {} }: LoadingProps) => (
	<span
		data-testid={'media-svg-loading'}
		role="status"
		css={loadingStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={{ width, height }}
	>
		<Spinner />
	</span>
);
