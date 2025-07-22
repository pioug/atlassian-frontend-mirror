/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotPadlockKey } from '../../../common/ui/spot/basics/padlock-key';

import { loadingErrorMessages } from './messages';

const styles = cssMap({
	iconContainerStyles: {
		marginBottom: token('space.200'),
	},
	descriptionMessageStyles: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200', '16px'),
	},
	urlStyles: {
		font: token('font.heading.medium'),
		color: token('color.text'),
		marginTop: token('space.negative.200'),
	},
});

const Description = ({ message, url }: { message: string; url: string }) => {
	return (
		<div css={styles.descriptionMessageStyles}>
			<span css={[styles.urlStyles]}>{url}</span>
			<span>{message}</span>
		</div>
	);
};

const IconContainer = () => {
	const { formatMessage } = useIntl();

	return (
		<Box xcss={styles.iconContainerStyles}>
			<SpotPadlockKey size={'xlarge'} alt={formatMessage(loadingErrorMessages.accessRequired)} />
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
				headingLevel={2}
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
