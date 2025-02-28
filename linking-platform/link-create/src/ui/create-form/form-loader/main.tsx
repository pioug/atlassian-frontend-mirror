/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Spinner, { type SpinnerProps } from '@atlaskit/spinner';

const formLoaderStyles = css({
	display: `flex`,
	alignItems: `center`,
	justifyContent: `center`,
	minHeight: `200px`,
});

/**
 * Wrapper component for the Spinner, shows while the form
 * performs async functions on load.
 */
export const CreateFormLoader = ({ size = 'large' }: Partial<SpinnerProps>): JSX.Element => {
	return (
		<div css={formLoaderStyles}>
			<Spinner size={size} interactionName="load" testId="link-create-form-loader" />
		</div>
	);
};
