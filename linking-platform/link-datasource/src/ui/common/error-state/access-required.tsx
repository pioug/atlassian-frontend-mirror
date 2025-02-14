/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { N400 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { AccessRequiredOld } from './access-required-old';
import { AccessRequiredSVGOld } from './access-required-svg';
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
		color: token('color.text.subtlest', N400),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		font: token('font.body', fontFallback.body.medium),
	},
});

const Description = ({ message, url }: { message: string; url: string }) => {
	return (
		<div css={styles.descriptionMessageStyles}>
			<span css={styles.urlStyles}>{url}</span>
			<span>{message}</span>
		</div>
	);
};

const IconContainer = () => (
	<Box xcss={styles.iconContainerStyles}>
		<AccessRequiredSVGOld />
	</Box>
);

interface AccessRequiredProps {
	/** The url to be displayed to the user when they are unauthorized to query */
	url?: string;
}

export const AccessRequiredNew = ({ url }: AccessRequiredProps) => {
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

export const AccessRequired = (props: AccessRequiredProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <AccessRequiredNew {...props} />;
	} else {
		return <AccessRequiredOld {...props} />;
	}
};
