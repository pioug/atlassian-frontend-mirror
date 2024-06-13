/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { LoadingErrorSVG } from './loading-error-svg';
import { loadingErrorMessages } from './messages';

const errorContainerStyles = css({
	display: 'grid',
	gap: token('space.200', '16px'),
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

interface LoadingErrorProps {
	onRefresh?: () => void;
}

export const LoadingError = ({ onRefresh }: LoadingErrorProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'network',
		});
	}, [fireEvent]);

	return (
		<div css={errorContainerStyles} data-testid="datasource--loading-error">
			<LoadingErrorSVG />
			<div css={errorMessageContainerStyles}>
				<span css={errorMessageStyles}>
					<FormattedMessage {...loadingErrorMessages.unableToLoadItems} />
				</span>
				<p css={errorDescriptionStyles}>
					<FormattedMessage {...loadingErrorMessages.checkConnection} />
				</p>
				{onRefresh && (
					<Button appearance="primary" onClick={onRefresh}>
						<FormattedMessage {...loadingErrorMessages.refresh} />
					</Button>
				)}
			</div>
		</div>
	);
};
