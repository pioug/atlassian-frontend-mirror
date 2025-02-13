/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { defineMessages, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK } from '../../../common/constants';
import { GenericErrorSVG } from '../../../common/generic-error-svg';
import { EmptyState } from '../../../common/ui/empty-state';
import { MinHeightContainer } from '../../../common/ui/min-height-container';

import { ErrorBoundaryFallbackOld } from './old';

const errorBoundaryFallbackStyles = css({
	font: token('font.heading.xxsmall'),
});
const oldErrorBoundaryFallbackStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'initial',
});

const messages = defineMessages({
	heading: {
		defaultMessage: 'Something went wrong!',
		description: 'Heading displayed when an unhandled error occurs.',
		id: 'fabric.linkPicker.unhandledError.heading',
	},
	description: {
		defaultMessage: 'Try reloading the page.',
		description: 'Body message shown underneath the heading when an unhandled error occurs.',
		id: 'fabric.linkPicker.unhandledError.description',
	},
});

export const ErrorBoundaryFallbackNew = () => {
	const intl = useIntl();
	const header = intl.formatMessage(messages.heading);
	const description = intl.formatMessage(messages.description);

	return (
		<MinHeightContainer
			css={[
				fg('platform-linking-visual-refresh-v1')
					? errorBoundaryFallbackStyles
					: oldErrorBoundaryFallbackStyles,
			]}
			minHeight={LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK}
			data-testid="link-picker-root-error-boundary-ui"
		>
			<EmptyState
				header={header}
				renderImage={() => <GenericErrorSVG />}
				description={description}
			/>
		</MinHeightContainer>
	);
};

export const ErrorBoundaryFallback = () => {
	if (fg('platform_bandicoots-link-picker-css')) {
		return <ErrorBoundaryFallbackNew />;
	}
	return <ErrorBoundaryFallbackOld />;
};
