import React from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { Box, Stack, xcss } from '@atlaskit/primitives';

import ErrorIcon from './error-icon';

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

const errorStateStyles = xcss({
	textAlign: 'center',
	marginTop: 'space.500',
});

const imageContainerStyles = xcss({
	display: 'block',
	maxWidth: '116px',
	maxHeight: '156px',
	marginBottom: 'space.300',
	marginTop: 'space.050',
});

const descriptionStyles = xcss({
	maxWidth: '360px',
});

export const AutomationModalErrorState = () => {
	const { formatMessage } = useIntl();

	return (
		<Stack xcss={errorStateStyles} alignInline="center" alignBlock="center">
			<Box xcss={imageContainerStyles}>
				<ErrorIcon />
			</Box>
			<Box xcss={descriptionStyles}>{formatMessage(i18n.errorDescription)}</Box>
		</Stack>
	);
};
