/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import Spinner, { type SpinnerProps } from '@atlaskit/spinner';

import { CreateFormLoaderOld } from './old/main';

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
const CreateFormLoaderNew = ({ size = 'large' }: Partial<SpinnerProps>): JSX.Element => {
	return (
		<div css={formLoaderStyles}>
			<Spinner size={size} interactionName="load" testId="link-create-form-loader" />
		</div>
	);
};

export const CreateFormLoader = (props: Partial<SpinnerProps>) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <CreateFormLoaderNew {...props} />;
	}
	return <CreateFormLoaderOld {...props} />;
};
