/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import { LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK } from '../../../common/constants';
import { GenericErrorSVG } from '../../../common/generic-error-svg';
import { EmptyState } from '../../../common/ui/empty-state';
import { MinHeightContainer } from '../../../common/ui/min-height-container';

const errorBoundaryFallbackStyles = css({
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

export const ErrorBoundaryFallback = () => {
	const intl = useIntl();
	const header = intl.formatMessage(messages.heading);
	const description = intl.formatMessage(messages.description);

	return (
		<MinHeightContainer
			css={errorBoundaryFallbackStyles}
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
