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
import { GenericErrorSVGV2 } from '../../../common/generic-error-svg-v2';
import { EmptyState } from '../../../common/ui/empty-state';
import { MinHeightContainer } from '../../../common/ui/min-height-container';

const errorBoundaryFallbackStyles = css({
	font: token('font.heading.xxsmall'),
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
			css={[errorBoundaryFallbackStyles]}
			minHeight={LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK}
			data-testid="link-picker-root-error-boundary-ui"
		>
			<EmptyState
				header={header}
				renderImage={
					fg('platform-linking-visual-refresh-link-picker')
						? () => <GenericErrorSVGV2 />
						: () => <GenericErrorSVG />
				}
				description={description}
			/>
		</MinHeightContainer>
	);
};
