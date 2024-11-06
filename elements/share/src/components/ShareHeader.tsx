import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Box, xcss } from '@atlaskit/primitives';

import { messages } from '../i18n';

export type Props = {
	title?: React.ReactNode;
};
const headerWrapperStyles = xcss({
	display: 'flex',
	justifyContent: 'space-between',
	marginRight: 'space.400',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	lineHeight: 'space.400',
});

export const ShareHeader = ({ title }: Props) => {
	return (
		<Box xcss={headerWrapperStyles}>
			<Heading level="h500">{title || <FormattedMessage {...messages.formTitle} />}</Heading>
		</Box>
	);
};
