/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Spinner, { type SpinnerProps } from '@atlaskit/spinner';

import { CREATE_FORM_MIN_HEIGHT_IN_PX } from '../../../common/constants';

const formLoaderStyles = css({
	display: `flex`,
	alignItems: `center`,
	justifyContent: `center`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${CREATE_FORM_MIN_HEIGHT_IN_PX}px`,
});

/**
 * Wrapper component for the Spinner, shows while the form
 * performs async functions on load.
 */
export function CreateFormLoader({ size = 'large' }: Partial<SpinnerProps>) {
	return (
		<div css={formLoaderStyles}>
			<Spinner size={size} interactionName="load" testId="link-create-form-loader" />
		</div>
	);
}
