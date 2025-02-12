/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { N400 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotPadlockKey } from '../../../common/ui/spot/basics/padlock-key';

import { AccessRequiredSVGOld } from './access-required-svg';
import { loadingErrorMessages } from './messages';

const urlStyles = css({
	color: token('color.text.subtlest', N400),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body', fontFallback.body.medium),
});

const descriptionMessageStyles = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.200', '16px'),
});

const iconContainerStyles = xcss({
	marginBottom: 'space.200',
});

const Description = ({ message, url }: { message: string; url: string }) => {
	return (
		<div css={descriptionMessageStyles}>
			<span css={urlStyles}>{url}</span>
			<span>{message}</span>
		</div>
	);
};

const noop = () => '';

const IconContainer = () => {
	const { formatMessage } = fg('bandicoots-update-sllv-icons')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIntl()
		: { formatMessage: noop };

	return (
		<Box xcss={iconContainerStyles}>
			{fg('bandicoots-update-sllv-icons') ? (
				<SpotPadlockKey size={'xlarge'} alt={formatMessage(loadingErrorMessages.accessRequired)} />
			) : (
				<AccessRequiredSVGOld />
			)}
		</Box>
	);
};

interface AccessRequiredProps {
	/** The url to be displayed to the user when they are unauthorized to query */
	url?: string;
}

export const AccessRequired = ({ url }: AccessRequiredProps) => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.shown', {
			reason: 'access',
		});
	}, [fireEvent]);

	if (url) {
		return (
			<EmptyState
				testId="datasource--access-required-with-url"
				header={formatMessage(loadingErrorMessages.accessRequiredWithSite)}
				description={
					<Description message={formatMessage(loadingErrorMessages.accessInstructions)} url={url} />
				}
				renderImage={IconContainer}
			/>
		);
	}

	return (
		<EmptyState
			testId="datasource--access-required"
			header={formatMessage(loadingErrorMessages.accessRequired)}
			description={formatMessage(loadingErrorMessages.accessInstructions)}
			renderImage={IconContainer}
		/>
	);
};
