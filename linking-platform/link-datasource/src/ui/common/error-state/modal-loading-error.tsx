/** @jsx jsx */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { LoadingErrorSVG } from './loading-error-svg';
import { loadingErrorMessages } from './messages';

const errorContainerStyles = css({
	display: 'grid',
	gap: token('space.300', '24px'),
	placeItems: 'center',
	placeSelf: 'center',
});

const errorMessageContainerStyles = css({
	display: 'grid',
	gap: token('space.100', '8px'),
	placeItems: 'center',
});

const errorMessageStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.small', fontFallback.heading.small),
});

const errorDescriptionStyles = css({
	margin: 0,
});

interface ModalLoadingErrorProps {
	errorMessage?: React.ReactNode;
}

export const ModalLoadingError = ({
	errorMessage = <FormattedMessage {...loadingErrorMessages.checkConnection} />,
}: ModalLoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	return (
		<div css={errorContainerStyles} data-testid="datasource-modal--loading-error">
			<LoadingErrorSVG />
			<div css={errorMessageContainerStyles}>
				<span css={errorMessageStyles}>
					<FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
				</span>
				<p css={errorDescriptionStyles}>{errorMessage}</p>
			</div>
		</div>
	);
};
