/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { defineMessages, useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AutomationModalErrorStateOld } from './AutomationModalErrorStateOld';
import ErrorIcon from './error-icon';

const styles = cssMap({
	errorState: {
		textAlign: 'center',
		marginTop: token('space.500'),
	},
	imageContainer: {
		display: 'block',
		maxWidth: '116px',
		maxHeight: '156px',
		marginBottom: token('space.300'),
		marginTop: token('space.050'),
	},
	description: {
		maxWidth: '360px',
	},
});

const i18n = defineMessages({
	errorDescription: {
		id: 'automation-menu.modal.error.description',
		defaultMessage: 'This is taking awhile to load. Try refreshing the page.',
		description: "Description for the error section shown when rules can't be fetched",
	},
	errorIconLabel: {
		id: 'automation-menu.modal.error.image.alt',
		defaultMessage: 'Error icon',
		description: 'Alternative text for the image that renders when there is an error.',
	},
});

const AutomationModalErrorStateNew = () => {
	const { formatMessage } = useIntl();

	return (
		<Stack xcss={styles.errorState} alignInline="center" alignBlock="center">
			<Box xcss={styles.imageContainer}>
				<ErrorIcon />
			</Box>
			<Box xcss={styles.description}>{formatMessage(i18n.errorDescription)}</Box>
		</Stack>
	);
};

export const AutomationModalErrorState = () => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AutomationModalErrorStateNew />;
	}
	return <AutomationModalErrorStateOld />;
};
